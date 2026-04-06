import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Nurse } from "../interfaces";
import { UnitSelection } from "./UnitSelection.tsx";
import { faker } from "@faker-js/faker";
import { Unit } from "../interfaces/Unit.ts";

export const AddNurseModal = ({
  showModal,
  hideModal,
  addNurse,
  units,
}: {
  showModal: boolean;
  hideModal: () => void;
  addNurse: (nurse: Nurse) => void;
  units: Unit[];
}) => {
  const [nurse, setNurse] = useState<Partial<Nurse>>();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    }

    if (nurse?.nurse_name && nurse?.unit) {
      const newNurse: Nurse = {
        id: faker.number.int(),
        nurse_name: nurse.nurse_name,
        years_exp: 0, // default
        unit: nurse.unit,
        unitDetails: { id: nurse.unit, unit_name: "Unit" },
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
            <Label htmlFor="nurse-name">Nurse Name</Label>
            <Input
              id="nurse-name"
              required
              defaultValue={nurse?.nurse_name}
              onChange={(e) => {
                const value = e.currentTarget.value;
                setNurse((nurse) => ({ ...nurse, nurse_name: value }));
              }}
            />
          </div>
          <UnitSelection
            units={units}
            onChange={(id) =>
              setNurse((nurse) => ({ ...nurse, unit: Number(id) }))
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
