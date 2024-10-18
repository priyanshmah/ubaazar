import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { OrbitProgress } from "react-loading-indicators";


export default function Loading(loading) {
  return (
    <Dialog open={loading}>
      <DialogContent className="w-fit rounded-2xl">
        <OrbitProgress color={"#FF6100"} size="small" />
      </DialogContent>
    </Dialog>
  );
}
