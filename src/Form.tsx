import { useEffect, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import {faker} from "@faker-js/faker";

interface Unit {
    name: string
  }

const getFilteredItems = (query, units) => {
    if (!query) {
        return units;
    }
    return units.filter(unit => unit.name.toLowerCase().startsWith(query))
}

  //get units and set to state
export const UnitForm = ({selected_unit, setSelectedUnit}) => {
    const [query, setQuery] = useState("");
    const [units, setUnits] = useState<any[]>(() => 
    Array.from({length: 20}, () => {
        const unit: Unit = {
            name: faker.lorem.word(),
        }
        return unit
    }))

    const filtered_items = getFilteredItems(query, units);

    return (
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            {selected_unit === null 
            ? "Select your unit"
            : selected_unit
        }
          </Dropdown.Toggle>
    
          <Dropdown.Menu>
          <Form.Control
          autoFocus
          className="mx-3 my-2 w-auto"
          placeholder="Type your unit"
          onChange={e => setQuery(e.target.value)}
        // const filterValue = e.target.value.toLowerCase();
          
        />
            {filtered_items.map(unit=>(
                <Dropdown.Item onClick={() => setSelectedUnit(unit.name)} href="#/action-1">{unit.name}</Dropdown.Item>
            ))}
            
          </Dropdown.Menu>
        </Dropdown>
      );
}
