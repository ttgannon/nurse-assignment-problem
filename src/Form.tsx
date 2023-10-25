import { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';

export const UnitForm = () => {
    const [units, setUnits] = useState<any>()//could be object, string, db query?
    const handleChange = (e) => {
        setUnits(e.target.value);
    }
    
    return (
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Select your unit
          </Dropdown.Toggle>
    
          <Dropdown.Menu>
          <Form.Control
          autoFocus
          className="mx-3 my-2 w-auto"
          placeholder="Type to filter..."
          onChange={(e) => setUnits(e.target.value)}
          value={units}
        />
            <Dropdown.Item href="#/action-1">Unit 1</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Unit 2</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Unit 3</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
}

// <form>
        //     <input type="text" value={units} onChange={handleChange} />
        //     <button onClick={handleSubmit} >Select your unit</button>
        // </form>