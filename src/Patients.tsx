export const PatientList = ({patients}) => {
    console.log(patients);
    return (
        <>
        <h1>Here are the unit patients</h1>
        {
            patients.map(patient => (
                <div>
                    <h4>{patient.fullName}</h4>
                    <h6>{patient.unitName}</h6>
                </div>
            ))
        }
        </>
    )
}