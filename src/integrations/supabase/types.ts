export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      artisans: {
        Row: {
          adresse: string | null
          annee_creation: number | null
          annees_experience: string | null
          bio: string | null
          capacite_mois: string | null
          chantier_signature: string | null
          code_postal: string
          created_at: string
          credits_balance: number
          decennale_compagnie: string | null
          decennale_numero: string | null
          decennale_validite: string | null
          delai_demarrage: string | null
          effectif: string | null
          email: string
          essences: string[]
          finitions: string[]
          forme_juridique: string | null
          id: string
          instagram: string | null
          pause_until: string | null
          pose_min: number | null
          qualibat: boolean
          raison_sociale: string
          rayon_km: number
          rc_pro_compagnie: string | null
          rc_pro_numero: string | null
          representant: string
          rge: boolean
          siret: string
          site_web: string | null
          specialites: string[]
          status: Database["public"]["Enums"]["artisan_status"]
          tarif_indicatif: string | null
          telephone: string
          updated_at: string
          user_id: string
          ville: string
        }
        Insert: {
          adresse?: string | null
          annee_creation?: number | null
          annees_experience?: string | null
          bio?: string | null
          capacite_mois?: string | null
          chantier_signature?: string | null
          code_postal: string
          created_at?: string
          credits_balance?: number
          decennale_compagnie?: string | null
          decennale_numero?: string | null
          decennale_validite?: string | null
          delai_demarrage?: string | null
          effectif?: string | null
          email: string
          essences?: string[]
          finitions?: string[]
          forme_juridique?: string | null
          id?: string
          instagram?: string | null
          pause_until?: string | null
          pose_min?: number | null
          qualibat?: boolean
          raison_sociale: string
          rayon_km?: number
          rc_pro_compagnie?: string | null
          rc_pro_numero?: string | null
          representant: string
          rge?: boolean
          siret: string
          site_web?: string | null
          specialites?: string[]
          status?: Database["public"]["Enums"]["artisan_status"]
          tarif_indicatif?: string | null
          telephone: string
          updated_at?: string
          user_id: string
          ville: string
        }
        Update: {
          adresse?: string | null
          annee_creation?: number | null
          annees_experience?: string | null
          bio?: string | null
          capacite_mois?: string | null
          chantier_signature?: string | null
          code_postal?: string
          created_at?: string
          credits_balance?: number
          decennale_compagnie?: string | null
          decennale_numero?: string | null
          decennale_validite?: string | null
          delai_demarrage?: string | null
          effectif?: string | null
          email?: string
          essences?: string[]
          finitions?: string[]
          forme_juridique?: string | null
          id?: string
          instagram?: string | null
          pause_until?: string | null
          pose_min?: number | null
          qualibat?: boolean
          raison_sociale?: string
          rayon_km?: number
          rc_pro_compagnie?: string | null
          rc_pro_numero?: string | null
          representant?: string
          rge?: boolean
          siret?: string
          site_web?: string | null
          specialites?: string[]
          status?: Database["public"]["Enums"]["artisan_status"]
          tarif_indicatif?: string | null
          telephone?: string
          updated_at?: string
          user_id?: string
          ville?: string
        }
        Relationships: []
      }
      credits_transactions: {
        Row: {
          amount: number
          artisan_id: string
          balance_after: number
          created_at: string
          description: string | null
          id: string
          match_id: string | null
          project_id: string | null
          stripe_session_id: string | null
          type: Database["public"]["Enums"]["credit_tx_type"]
        }
        Insert: {
          amount: number
          artisan_id: string
          balance_after: number
          created_at?: string
          description?: string | null
          id?: string
          match_id?: string | null
          project_id?: string | null
          stripe_session_id?: string | null
          type: Database["public"]["Enums"]["credit_tx_type"]
        }
        Update: {
          amount?: number
          artisan_id?: string
          balance_after?: number
          created_at?: string
          description?: string | null
          id?: string
          match_id?: string | null
          project_id?: string | null
          stripe_session_id?: string | null
          type?: Database["public"]["Enums"]["credit_tx_type"]
        }
        Relationships: [
          {
            foreignKeyName: "credits_transactions_artisan_id_fkey"
            columns: ["artisan_id"]
            isOneToOne: false
            referencedRelation: "artisans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credits_transactions_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "project_matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credits_transactions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      guide_downloads: {
        Row: {
          created_at: string
          email: string
          id: string
          j2_sent_at: string | null
          j7_sent_at: string | null
          name: string | null
          opt_in: boolean
          segment: string | null
          source: string | null
          unsubscribed_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          j2_sent_at?: string | null
          j7_sent_at?: string | null
          name?: string | null
          opt_in?: boolean
          segment?: string | null
          source?: string | null
          unsubscribed_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          j2_sent_at?: string | null
          j7_sent_at?: string | null
          name?: string | null
          opt_in?: boolean
          segment?: string | null
          source?: string | null
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      project_matches: {
        Row: {
          artisan_id: string
          created_at: string
          decided_at: string | null
          expires_at: string
          id: string
          match_score: number | null
          project_id: string
          proposed_at: string
          refund_reason: string | null
          status: Database["public"]["Enums"]["match_status"]
          updated_at: string
        }
        Insert: {
          artisan_id: string
          created_at?: string
          decided_at?: string | null
          expires_at?: string
          id?: string
          match_score?: number | null
          project_id: string
          proposed_at?: string
          refund_reason?: string | null
          status?: Database["public"]["Enums"]["match_status"]
          updated_at?: string
        }
        Update: {
          artisan_id?: string
          created_at?: string
          decided_at?: string | null
          expires_at?: string
          id?: string
          match_score?: number | null
          project_id?: string
          proposed_at?: string
          refund_reason?: string | null
          status?: Database["public"]["Enums"]["match_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_matches_artisan_id_fkey"
            columns: ["artisan_id"]
            isOneToOne: false
            referencedRelation: "artisans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_matches_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          accepted_at: string | null
          budget_max: number | null
          budget_min: number | null
          client_email: string
          client_name: string
          client_phone: string | null
          client_user_id: string | null
          closed_at: string | null
          code_postal: string
          created_at: string
          credits_cost: number
          delai_souhaite: string | null
          description: string | null
          etat_sol: string | null
          expires_at: string | null
          id: string
          matched_artisan_id: string | null
          matched_at: string | null
          reference: string
          required_specialites: string[]
          source: string
          status: Database["public"]["Enums"]["project_status"]
          surface_m2: number | null
          type_bois: string | null
          type_pose: string | null
          updated_at: string
          ville: string
        }
        Insert: {
          accepted_at?: string | null
          budget_max?: number | null
          budget_min?: number | null
          client_email: string
          client_name: string
          client_phone?: string | null
          client_user_id?: string | null
          closed_at?: string | null
          code_postal: string
          created_at?: string
          credits_cost?: number
          delai_souhaite?: string | null
          description?: string | null
          etat_sol?: string | null
          expires_at?: string | null
          id?: string
          matched_artisan_id?: string | null
          matched_at?: string | null
          reference?: string
          required_specialites?: string[]
          source?: string
          status?: Database["public"]["Enums"]["project_status"]
          surface_m2?: number | null
          type_bois?: string | null
          type_pose?: string | null
          updated_at?: string
          ville: string
        }
        Update: {
          accepted_at?: string | null
          budget_max?: number | null
          budget_min?: number | null
          client_email?: string
          client_name?: string
          client_phone?: string | null
          client_user_id?: string | null
          closed_at?: string | null
          code_postal?: string
          created_at?: string
          credits_cost?: number
          delai_souhaite?: string | null
          description?: string | null
          etat_sol?: string | null
          expires_at?: string | null
          id?: string
          matched_artisan_id?: string | null
          matched_at?: string | null
          reference?: string
          required_specialites?: string[]
          source?: string
          status?: Database["public"]["Enums"]["project_status"]
          surface_m2?: number | null
          type_bois?: string | null
          type_pose?: string | null
          updated_at?: string
          ville?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_matched_artisan_id_fkey"
            columns: ["matched_artisan_id"]
            isOneToOne: false
            referencedRelation: "artisans"
            referencedColumns: ["id"]
          },
        ]
      }
      tracking_events: {
        Row: {
          created_at: string
          event: string
          id: string
          meta: Json | null
          path: string | null
          referrer: string | null
          segment: string | null
          session_id: string | null
        }
        Insert: {
          created_at?: string
          event: string
          id?: string
          meta?: Json | null
          path?: string | null
          referrer?: string | null
          segment?: string | null
          session_id?: string | null
        }
        Update: {
          created_at?: string
          event?: string
          id?: string
          meta?: Json | null
          path?: string | null
          referrer?: string | null
          segment?: string | null
          session_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_project_match: { Args: { _match_id: string }; Returns: Json }
      generate_project_ref: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      refund_project_match: {
        Args: { _match_id: string; _reason: string }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "artisan" | "client"
      artisan_status: "pending" | "verified" | "suspended" | "rejected"
      credit_tx_type: "purchase" | "debit" | "refund" | "bonus" | "adjustment"
      match_status: "pending" | "accepted" | "declined" | "expired" | "refunded"
      project_status:
        | "qualified"
        | "matched"
        | "accepted"
        | "completed"
        | "closed"
        | "refunded"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "artisan", "client"],
      artisan_status: ["pending", "verified", "suspended", "rejected"],
      credit_tx_type: ["purchase", "debit", "refund", "bonus", "adjustment"],
      match_status: ["pending", "accepted", "declined", "expired", "refunded"],
      project_status: [
        "qualified",
        "matched",
        "accepted",
        "completed",
        "closed",
        "refunded",
      ],
    },
  },
} as const
