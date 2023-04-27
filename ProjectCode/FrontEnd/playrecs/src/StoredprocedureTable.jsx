import axios from "axios";
import React, { useEffect, useState } from "react";
import "./App.css"

const StoreprocedureTable = () => {

    const [spdata, setSpdata] = useState(null);

    useEffect(() => {
        const getspdata = async () => {
            const res = await axios.get("http://localhost:3002/api/storeprocedure");
            setSpdata(res.data.sqldata[1]);
        };

        getspdata();
    }, []);

    
    return (
        <table>
            <thead>
                <tr>
                    <th>Required Age</th>
                    <th>Game Count</th>
                </tr>
            </thead>
            <tbody>
                {spdata?.map((r => (
                    <tr>
                        <td>{r.requiredAge}</td>
                        <td>{r.game_count}</td>
                    </tr>
                )))}
            </tbody>
        </table>
    );
};

export default StoreprocedureTable;
