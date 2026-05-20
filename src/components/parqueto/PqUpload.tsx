import * as React from "react";
import { UploadCloud, ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PqUploadProps {
  label?: string;
  hint?: string;
  multiple?: boolean;
  accept?: string;
  files?: { name: string; size?: string }[];
  onRemove?: (name: string) => void;
  onPick?: (files: FileList) => void;
  className?: string;
}

export function PqUpload({
  label = "Glissez vos fichiers ici",
  hint = "PNG, JPG ou PDF jusqu'à 10 Mo",
  multiple,
  accept,
  files = [],
  onRemove,
  onPick,
  className,
}: PqUploadProps) {
  const [hover, setHover] = React.useState(false);
  const ref = React.useRef<HTMLInputElement>(null);

  return (
    <div className={cn("space-y-2", className)}>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setHover(true);
        }}
        onDragLeave={() => setHover(false)}
        onDrop={(e) => {
          e.preventDefault();
          setHover(false);
          if (e.dataTransfer.files.length) onPick?.(e.dataTransfer.files);
        }}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 text-center transition",
          hover
            ? "border-brand-orange bg-brand-orange/5"
            : "border-border bg-card hover:border-brand-orange/40 hover:bg-brand-orange/[0.03]"
        )}
      >
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange">
          <UploadCloud className="size-5" />
        </span>
        <span className="font-display text-base text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">{hint}</span>
        <span className="mt-1 text-[11px] font-medium text-brand-orange">ou cliquez pour parcourir</span>
        <input
          ref={ref}
          type="file"
          multiple={multiple}
          accept={accept}
          className="hidden"
          onChange={(e) => e.target.files && onPick?.(e.target.files)}
        />
      </button>

      {files.length > 0 && (
        <ul className="space-y-1.5">
          {files.map((f) => (
            <li
              key={f.name}
              className="flex items-center justify-between gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs"
            >
              <span className="flex min-w-0 items-center gap-2">
                <ImageIcon className="size-3.5 shrink-0 text-brand-orange" />
                <span className="truncate font-medium text-foreground">{f.name}</span>
                {f.size && <span className="text-muted-foreground">· {f.size}</span>}
              </span>
              {onRemove && (
                <button
                  onClick={() => onRemove(f.name)}
                  aria-label={`Retirer ${f.name}`}
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="size-3" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
