import React, { useState } from "react";
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
import { Nurse, Unit } from "../../interfaces";
import { DemoUnitSelection } from "./DemoUnitSelection.tsx";

export const DemoAddNurseModal = ({
  showModal,
  hideModal,
  addNurse,
  units,
  nurses,
}: {
  showModal: boolean;
  hideModal: () => void;
  addNurse: (nurse: Nurse) => void;
  units: Unit[];
  nurses: Nurse[];
}) => {
  const [nurse, setNurse] = useState<Partial<Nurse>>();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    /* 
    
    Need to create a random ID for each additional nurse to render on the page; this lets React keep track of each element for removal. The below code achieves this.
    
    */
    const nurseIds = nurses.map((nurse) => {
      return nurse.id;
    });

    let randInt = 0;
    while (nurseIds.includes(randInt)) {
      randInt = Math.floor(Math.random() * 1000);
    }

    /* The below code creates a new instance of Nurse taking the name and unit fields, plus the random unique ID generated, and returns it to the Nurse Table. */

    if (nurse?.nurse_name && nurse?.unit) {
      const newNurse: Nurse = {
        id: randInt,
        nurse_name: nurse.nurse_name,
        years_exp: 0,
        unit: nurse.unit,
        unitDetails: units.find((u) => u.id === nurse.unit) || {
          id: nurse.unit,
          unit_name: "",
        },
      };

      addNurse(newNurse);
      hideModal();
    }
  };

  return (
    <Dialog open={showModal} onOpenChange={hideModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Nurse</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <Label htmlFor="demo-nurse-name">Nurse Name</Label>
            <Input
              id="demo-nurse-name"
              required
              defaultValue={nurse?.nurse_name}
              onChange={(e) => {
                const value = e.currentTarget.value;
                setNurse((nurse) => ({ ...nurse, nurse_name: value }));
              }}
            />
          </div>
          <DemoUnitSelection
            units={units.map((u) => ({ id: u.id, name: u.unit_name }))}
            onChange={(id) =>
              setNurse((nurse) => ({
                ...nurse,
                unit: id,
              }))
            }
          />
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={hideModal}>
              Close
            </Button>
            <Button type="submit">Add</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
