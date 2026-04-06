import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Nurse, Patient } from "../interfaces";
import { EpicPatient } from "../interfaces/LoggedInInterface/EpicPatient";
import { generateAssignments } from "../services";

export const Assignment = ({
  nurses,
  patients,
}: {
  nurses: Nurse[];
  patients: EpicPatient[] | Patient[];
}) => {
  const assignments = generateAssignments(patients, nurses);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {assignments.map(({ nurse, patients, assignmentAcuityScore }) => (
        <Card key={nurse.id} className="mb-3">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <strong>Nurse: </strong>
                {nurse.nurse_name}
              </div>
              <div>
                <p>Assignment Score: {assignmentAcuityScore}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {patients.length ? (
              <>
                <CardTitle>Patients</CardTitle>
                <ul>
                  {patients.every((patient) => "item" in patient)
                    ? patients.map((patient, index) => (
                        <li key={index}>
                          {(patient as EpicPatient).item.display}
                        </li>
                      ))
                    : patients.map((patient, index) => (
                        <li key={index}>
                          {(patient as Patient).first_name +
                            " " +
                            (patient as Patient).last_name}
                        </li>
                      ))}
                </ul>
              </>
            ) : (
              <span className="text-muted">No patients assigned</span>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
