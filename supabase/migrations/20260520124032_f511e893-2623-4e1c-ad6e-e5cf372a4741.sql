-- ============================================================================
-- ENUMS
-- ============================================================================
CREATE TYPE public.app_role AS ENUM ('admin', 'artisan', 'client');
CREATE TYPE public.artisan_status AS ENUM ('pending', 'verified', 'suspended', 'rejected');
CREATE TYPE public.project_status AS ENUM ('qualified', 'matched', 'accepted', 'completed', 'closed', 'refunded');
CREATE TYPE public.match_status AS ENUM ('pending', 'accepted', 'declined', 'expired', 'refunded');
CREATE TYPE public.credit_tx_type AS ENUM ('purchase', 'debit', 'refund', 'bonus', 'adjustment');

-- ============================================================================
-- UPDATE TIMESTAMP HELPER
-- ============================================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================================
-- PROFILES
-- ============================================================================
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  display_name text,
  email text,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- USER ROLES (separate table to prevent privilege escalation)
-- ============================================================================
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer to break RLS recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- ============================================================================
-- AUTH USER -> PROFILE TRIGGER
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, email, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    NEW.raw_user_meta_data->>'phone'
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- default role: client
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'client')
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- ARTISANS
-- ============================================================================
CREATE TABLE public.artisans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  raison_sociale text NOT NULL,
  representant text NOT NULL,
  email text NOT NULL,
  telephone text NOT NULL,
  siret text NOT NULL,
  annees_experience text,
  adresse text,
  ville text NOT NULL,
  code_postal text NOT NULL,
  rayon_km int NOT NULL DEFAULT 25 CHECK (rayon_km BETWEEN 1 AND 300),
  specialites text[] NOT NULL DEFAULT '{}',
  essences text[] NOT NULL DEFAULT '{}',
  finitions text[] NOT NULL DEFAULT '{}',
  pose_min int,
  capacite_mois text,
  delai_demarrage text,
  tarif_indicatif text,
  bio text,
  annee_creation int,
  effectif text,
  chantier_signature text,
  site_web text,
  instagram text,
  forme_juridique text,
  decennale_compagnie text,
  decennale_numero text,
  decennale_validite date,
  rc_pro_compagnie text,
  rc_pro_numero text,
  qualibat boolean NOT NULL DEFAULT false,
  rge boolean NOT NULL DEFAULT false,
  status artisan_status NOT NULL DEFAULT 'pending',
  credits_balance int NOT NULL DEFAULT 0 CHECK (credits_balance >= 0),
  pause_until date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.artisans ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_artisans_status ON public.artisans(status);
CREATE INDEX idx_artisans_code_postal ON public.artisans(code_postal);
CREATE INDEX idx_artisans_specialites ON public.artisans USING GIN(specialites);

CREATE TRIGGER trg_artisans_updated_at
BEFORE UPDATE ON public.artisans
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- When an artisan is created -> assign artisan role + bonus credits
CREATE OR REPLACE FUNCTION public.handle_new_artisan()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.user_id, 'artisan')
  ON CONFLICT DO NOTHING;

  -- 3 free credits at signup
  NEW.credits_balance = 3;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_artisans_bonus_credits
BEFORE INSERT ON public.artisans
FOR EACH ROW EXECUTE FUNCTION public.handle_new_artisan();

-- ============================================================================
-- PROJECTS
-- ============================================================================
CREATE OR REPLACE FUNCTION public.generate_project_ref()
RETURNS text
LANGUAGE sql
AS $$
  SELECT 'PRJ-' || upper(substring(replace(gen_random_uuid()::text, '-', ''), 1, 8))
$$;

CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE DEFAULT public.generate_project_ref(),
  client_user_id uuid,
  client_name text NOT NULL,
  client_email text NOT NULL,
  client_phone text,
  ville text NOT NULL,
  code_postal text NOT NULL,
  surface_m2 numeric(8,2),
  type_pose text,
  type_bois text,
  etat_sol text,
  budget_min int,
  budget_max int,
  delai_souhaite text,
  description text,
  required_specialites text[] NOT NULL DEFAULT '{}',
  source text NOT NULL DEFAULT 'estimateur',
  status project_status NOT NULL DEFAULT 'qualified',
  matched_artisan_id uuid REFERENCES public.artisans(id) ON DELETE SET NULL,
  credits_cost int NOT NULL DEFAULT 1 CHECK (credits_cost >= 0),
  matched_at timestamptz,
  accepted_at timestamptz,
  expires_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_matched_artisan ON public.projects(matched_artisan_id);
CREATE INDEX idx_projects_client_user ON public.projects(client_user_id);
CREATE INDEX idx_projects_code_postal ON public.projects(code_postal);

CREATE TRIGGER trg_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- PROJECT MATCHES (history of artisans the project was proposed to)
-- ============================================================================
CREATE TABLE public.project_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  artisan_id uuid NOT NULL REFERENCES public.artisans(id) ON DELETE CASCADE,
  status match_status NOT NULL DEFAULT 'pending',
  match_score int,
  proposed_at timestamptz NOT NULL DEFAULT now(),
  decided_at timestamptz,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '5 days'),
  refund_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (project_id, artisan_id)
);

ALTER TABLE public.project_matches ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_matches_artisan_status ON public.project_matches(artisan_id, status);
CREATE INDEX idx_matches_project ON public.project_matches(project_id);
CREATE INDEX idx_matches_expires ON public.project_matches(expires_at) WHERE status = 'pending';

CREATE TRIGGER trg_matches_updated_at
BEFORE UPDATE ON public.project_matches
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- CREDITS LEDGER
-- ============================================================================
CREATE TABLE public.credits_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artisan_id uuid NOT NULL REFERENCES public.artisans(id) ON DELETE CASCADE,
  amount int NOT NULL,
  type credit_tx_type NOT NULL,
  description text,
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  match_id uuid REFERENCES public.project_matches(id) ON DELETE SET NULL,
  stripe_session_id text,
  balance_after int NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.credits_transactions ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_credits_tx_artisan ON public.credits_transactions(artisan_id, created_at DESC);

-- Initial bonus transaction when artisan is created
CREATE OR REPLACE FUNCTION public.log_initial_bonus()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.credits_balance > 0 THEN
    INSERT INTO public.credits_transactions
      (artisan_id, amount, type, description, balance_after)
    VALUES
      (NEW.id, NEW.credits_balance, 'bonus', 'Bienvenue : 3 premiers projets offerts', NEW.credits_balance);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_artisans_initial_bonus
AFTER INSERT ON public.artisans
FOR EACH ROW EXECUTE FUNCTION public.log_initial_bonus();

-- ============================================================================
-- ACCEPT / REFUND ATOMIC FUNCTIONS
-- ============================================================================
CREATE OR REPLACE FUNCTION public.accept_project_match(_match_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _match RECORD;
  _artisan RECORD;
  _new_balance int;
BEGIN
  SELECT m.*, p.credits_cost AS project_cost
  INTO _match
  FROM public.project_matches m
  JOIN public.projects p ON p.id = m.project_id
  WHERE m.id = _match_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Proposition introuvable';
  END IF;

  IF _match.status <> 'pending' THEN
    RAISE EXCEPTION 'Cette proposition a déjà été traitée (%).', _match.status;
  END IF;

  IF _match.expires_at < now() THEN
    UPDATE public.project_matches SET status = 'expired', decided_at = now()
    WHERE id = _match_id;
    RAISE EXCEPTION 'Cette proposition a expiré';
  END IF;

  SELECT * INTO _artisan FROM public.artisans
  WHERE id = _match.artisan_id AND user_id = auth.uid()
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Non autorisé';
  END IF;

  IF _artisan.credits_balance < _match.project_cost THEN
    RAISE EXCEPTION 'Solde de crédits insuffisant';
  END IF;

  _new_balance := _artisan.credits_balance - _match.project_cost;

  UPDATE public.artisans
  SET credits_balance = _new_balance
  WHERE id = _artisan.id;

  UPDATE public.project_matches
  SET status = 'accepted', decided_at = now()
  WHERE id = _match_id;

  UPDATE public.projects
  SET status = 'accepted',
      accepted_at = now(),
      matched_artisan_id = _artisan.id
  WHERE id = _match.project_id;

  -- expire all other pending matches for this project
  UPDATE public.project_matches
  SET status = 'declined', decided_at = now()
  WHERE project_id = _match.project_id
    AND id <> _match_id
    AND status = 'pending';

  INSERT INTO public.credits_transactions
    (artisan_id, amount, type, description, project_id, match_id, balance_after)
  VALUES
    (_artisan.id, -_match.project_cost, 'debit',
     'Acceptation du projet', _match.project_id, _match_id, _new_balance);

  RETURN jsonb_build_object(
    'success', true,
    'new_balance', _new_balance,
    'project_id', _match.project_id
  );
END;
$$;

-- Refund (client unreachable, out of zone, etc.) — can be called by the artisan
CREATE OR REPLACE FUNCTION public.refund_project_match(_match_id uuid, _reason text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _match RECORD;
  _artisan RECORD;
  _refund_amount int;
  _new_balance int;
BEGIN
  SELECT m.*, p.credits_cost AS project_cost
  INTO _match
  FROM public.project_matches m
  JOIN public.projects p ON p.id = m.project_id
  WHERE m.id = _match_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Proposition introuvable';
  END IF;

  IF _match.status <> 'accepted' THEN
    RAISE EXCEPTION 'Seules les propositions acceptées peuvent être remboursées';
  END IF;

  IF _match.decided_at < now() - interval '5 days' THEN
    RAISE EXCEPTION 'Délai de remboursement de 5 jours dépassé';
  END IF;

  SELECT * INTO _artisan FROM public.artisans
  WHERE id = _match.artisan_id
    AND (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Non autorisé';
  END IF;

  _refund_amount := _match.project_cost;
  _new_balance := _artisan.credits_balance + _refund_amount;

  UPDATE public.artisans SET credits_balance = _new_balance WHERE id = _artisan.id;

  UPDATE public.project_matches
  SET status = 'refunded', refund_reason = _reason, decided_at = now()
  WHERE id = _match_id;

  UPDATE public.projects
  SET status = 'refunded', closed_at = now()
  WHERE id = _match.project_id;

  INSERT INTO public.credits_transactions
    (artisan_id, amount, type, description, project_id, match_id, balance_after)
  VALUES
    (_artisan.id, _refund_amount, 'refund',
     COALESCE('Remboursement : ' || _reason, 'Remboursement'),
     _match.project_id, _match_id, _new_balance);

  RETURN jsonb_build_object('success', true, 'new_balance', _new_balance);
END;
$$;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- profiles
CREATE POLICY "Users view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users insert own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- user_roles (read-only for users, admins manage)
CREATE POLICY "Users view own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- artisans
CREATE POLICY "Artisans view own record"
ON public.artisans FOR SELECT
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public view verified artisans (limited)"
ON public.artisans FOR SELECT
USING (status = 'verified');

CREATE POLICY "Artisans create own record"
ON public.artisans FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Artisans update own record (limited fields)"
ON public.artisans FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins manage all artisans"
ON public.artisans FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- projects
-- Anyone (incl. anonymous) can submit a project from the public estimator
CREATE POLICY "Anyone can submit a project"
ON public.projects FOR INSERT
WITH CHECK (true);

CREATE POLICY "Client views own projects"
ON public.projects FOR SELECT
USING (client_user_id = auth.uid());

CREATE POLICY "Artisan views matched projects"
ON public.projects FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.project_matches m
    JOIN public.artisans a ON a.id = m.artisan_id
    WHERE m.project_id = projects.id
      AND a.user_id = auth.uid()
  )
);

CREATE POLICY "Admins manage all projects"
ON public.projects FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- project_matches
CREATE POLICY "Artisan views own matches"
ON public.project_matches FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.artisans a
    WHERE a.id = project_matches.artisan_id AND a.user_id = auth.uid()
  )
);

CREATE POLICY "Admins manage all matches"
ON public.project_matches FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- credits_transactions
CREATE POLICY "Artisan views own credits history"
ON public.credits_transactions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.artisans a
    WHERE a.id = credits_transactions.artisan_id AND a.user_id = auth.uid()
  )
);

CREATE POLICY "Admins manage credits"
ON public.credits_transactions FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));