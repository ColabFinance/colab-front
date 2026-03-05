import * as React from "react";

type Props = React.SVGProps<SVGSVGElement> & { size?: number };

function IconBase({ size = 18, ...props }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props} />
  );
}

export function PlusIcon(props: Props) {
  return (
    <IconBase {...props}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </IconBase>
  );
}

export function AlertTriangleIcon(props: Props) {
  return (
    <IconBase {...props}>
      <path
        d="M12 3l10 18H2L12 3z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M12 9v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 17h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </IconBase>
  );
}

export function CopyIcon(props: Props) {
  return (
    <IconBase {...props}>
      <path
        d="M9 9h10v10H9V9z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </IconBase>
  );
}

export function PencilIcon(props: Props) {
  return (
    <IconBase {...props}>
      <path
        d="M3 21h3l12-12-3-3L3 18v3z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M14 6l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </IconBase>
  );
}

export function RotateIcon(props: Props) {
  return (
    <IconBase {...props}>
      <path
        d="M21 12a9 9 0 1 1-3-6.7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M21 3v6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </IconBase>
  );
}

export function ChevronRightIcon(props: Props) {
  return (
    <IconBase {...props}>
      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </IconBase>
  );
}

export function RocketIcon(props: Props) {
  return (
    <IconBase {...props}>
      <path
        d="M14 4c4 1 6 5 6 10-5 0-9-2-10-6l4-4z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M4 14c1-4 5-6 10-6-1 5-3 9-6 10l-4-4z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M10 14l-2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 10l6-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </IconBase>
  );
}

export function LinkIcon(props: Props) {
  return (
    <IconBase {...props}>
      <path
        d="M10 13a5 5 0 0 0 7.1 0l1.4-1.4a5 5 0 0 0-7.1-7.1L10 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M14 11a5 5 0 0 0-7.1 0L5.5 12.4a5 5 0 0 0 7.1 7.1L14 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </IconBase>
  );
}

export function XIcon(props: Props) {
  return (
    <IconBase {...props}>
      <path d="M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </IconBase>
  );
}

export function CheckIcon(props: Props) {
  return (
    <IconBase {...props}>
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </IconBase>
  );
}

export function InfoIcon(props: Props) {
  return (
    <IconBase {...props}>
      <path
        d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M12 10v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 7h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </IconBase>
  );
}