import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export const GetInTouchModal = ({
  showModal,
  hideModal,
}: {
  showModal: boolean;
  hideModal: () => void;
}) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    console.log(`submitted form`);
    hideModal();
  };

  return (
    <Dialog open={showModal} onOpenChange={hideModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Get in touch</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <Label htmlFor="name">Your name</Label>
            <Input id="name" required />
            <Label htmlFor="email" className="mt-3">
              Your email
            </Label>
            <Input id="email" required type="email" />
            <Label htmlFor="inquiry" className="mt-3">
              Your inquiry
            </Label>
            <textarea id="inquiry" className="form-control" rows={3}></textarea>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={hideModal}>
              Close
            </Button>
            <Button type="submit">Send</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
