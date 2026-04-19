import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";

export interface ExpandButtonProps {
  ariaLabel?: string;
  expanded: boolean;
  onClick?: () => void;
  className?: string;
}

export function ExpandButton({ ariaLabel = "Show More", expanded, onClick, className }: Readonly<ExpandButtonProps>) {
  return (
    <Button onClick={onClick} aria-expanded={expanded} aria-label={ariaLabel} className={className}>
      <ExpandMoreIcon
        sx={{
          transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
          transition: (theme) =>
            theme.transitions.create("transform", {
              duration: theme.transitions.duration.shortest,
            }),
        }}
      />
    </Button>
  );
}
