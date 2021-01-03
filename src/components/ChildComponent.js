import React from 'react';
import Button from '@material-ui/core/Button';
import { Storage} from 'aws-amplify';
import { DataStore } from '@aws-amplify/datastore'
import {Record} from "./../models";

const url = "https://bln9cf30wj.execute-api.ap-southeast-1.amazonaws.com/default/pythontest?filename=s3://amplifyjsdb22d608f3e94d85852ea891d3a9bbca114347-dev/public/"

var results = []

async function doWriteDB(record) {
    console.log("write to db", (new Date()).toISOString());
    await DataStore.save(record);
}

function callSQIAPI(fileName, props){
      var apiURL = url + fileName;

      // perform API call to get SQI
      fetch(apiURL)
        .then(response => response.json())
        .then(result => {
              // write to DB
              let record = new Record({
                name: result.recordname,
                samplingRate: 500,
                gestationAge: 28,
              mSQICh1: result.ch1msqi,
              mSQICh2: result.ch2msqi,
              mSQICh3: result.ch3msqi,
              mSQICh4: result.ch4msqi,
              fSQICh1: result.ch1fsqi,
              fSQICh2: result.ch2fsqi,
              fSQICh3: result.ch3fsqi,
              fSQICh4: result.ch4fsqi,
              rawECGSQI: result.rawecgsqi,
              signalLost: result.signallostratio,
              createdDate: (new Date()).toISOString(),
              description: "Test"
              })
              
              doWriteDB(record);
              // update result and result table
              results.push(result);
              props.onClick(results);
      })
        .catch(error => console.log('error', error));
}

const ChildComponent = (props) => {
    const [file, setFile] = React.useState()
    

    const onSubmit = (event) => {
        let uploadFile = file;
        if (!uploadFile) {
            alert("Choose a valid file ");
        } else {
            let fileName = uploadFile.name
            Storage.put(fileName, uploadFile, {
                contentType: 'image/png'
            })
            .then (result => {
                callSQIAPI(fileName, props);
            })
            .catch(err => console.log(err));
        }
    }

    const onChange = (event) => {
        setFile(event.target.files[0]);
    }

    return (
        <div>
            <input 
            variant="contained"
            component="span"
            accept="text/csv"
            id="contained-button-file"
            multiple
            type="file"
            onChange = {event => {onChange(event)}}
            />
        <Button 
            variant="contained"
            component="span"
            onClick = {event => {onSubmit(event)
        }}>
            Upload File
        </Button>
        </div>
    )
}

export default ChildComponent;