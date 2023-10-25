import {useState} from 'react'
import './App.css'
import {faker} from "@faker-js/faker";

interface Nurse {
    fullName: string
    yearsOfExperience: number
}

const App = () => {
    const [nurses] = useState<Nurse[]>(() => {
        return Array.from({length: 5}, () => {
            const nurse: Nurse = {
                fullName: faker.person.fullName(),
                yearsOfExperience: faker.number.int({
                    min: 0,
                    max: 30
                })
            }
            return nurse
        })
    })

    return (
        <>
            {
                nurses.map(nurse => (
                    <Nurse nurse={nurse}/>
                ))
            }
        </>
    )
};

const Nurse = ({nurse}: { nurse: Nurse }) => {
    return (
        <>
            <p>
                {nurse.fullName} ({nurse.yearsOfExperience} years)
            </p>
        </>
    )
}

export default App
