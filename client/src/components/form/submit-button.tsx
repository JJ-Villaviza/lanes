import { useStore } from "@tanstack/react-form";
import { useFormContext } from ".";
import { Button } from "../ui/button";

type Props = {
  children: React.ReactNode;
};

export const SubmitButton = ({ children }: Props) => {
  const form = useFormContext();

  const [isSubmitting, canSubmit] = useStore(form.store, (state) => [
    state.isSubmitting,
    state.canSubmit,
  ]);

  return (
    <Button type="submit" disabled={isSubmitting || !canSubmit}>
      {children}
    </Button>
  );
};
