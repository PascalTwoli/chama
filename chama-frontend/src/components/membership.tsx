
import { Button }  from "primereact/button";
import {Dropdown} from "primereact/dropdown"
import React, { useState } from "react";
import MembersTable from "./membership.table";

function Membership () {

    const [selectedFilter, setSelectedFilter] = useState("all")
    const filters = [
        {label: "All members", value: "all"},
        {label: "Active", value: "active"},
        {label: "Disabled", value: "disabled"}
    ]
    return (
    <>
    {/* membership header */}
        <div className="flex justify-between items-center rounded-md">
            {/* Title */}
            <h2 className="text-white text-xl font-bold">Twoli AC’s group members</h2>

            {/* Actions */}
            <div className="flex items-center gap-4">
                {/* Add Member Button */}
                <Button
                label="Add Member"
                icon="pi bi-person-plus"
                className=" flex gap-3 p-button-outlined p-button-sm text-[#4084B9] border-[#4084B9] border-solid border rounded-xl p-2"
                />

                {/* Filter Label + Dropdown */}
                <div className="flex items-center gap-2 text-white">
                    <span className="text-gray-300 font-bold">Filter:</span>
                    <Dropdown
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.value)}
                        options={filters}
                        optionLabel="label"
                        placeholder="All members"
                        className={`w-36 hover:bg-[#4084B9] bg-white p-2  rounded-md text-black hover:text-white`}
                        panelClassName=" rounded-md mt-2"
                        pt={{
                            root: {
                              className: "focus:bg-green active:bg-red",
                            },
                            panel: {
                              className: "bg-gray-800 rounded-md py-2",
                            },
                            item: {
                              className: "hover:bg-gray-200 hover:text-black px-3 py-2 cursor-pointer bg-blue text-white",
                            },
                          }}
                    />
                </div>
            </div>
        </div>
        <div className="flex justify-end mt-8 mb-7">
            <div className="flex gap-2 max-w-40 text-gray-400 font-bold ">
                Search: 
                <input type="text" className="w-full p-px  border border-gray-500 rounded bg-gray-700 placeholder:font-bold placeholder:text-gray-300 focus:outline focus:outline-[#4084B9] focus:border focus:border-[#4084B9] px-2" />
            </div>
        </div>

        <MembersTable/>
    </>
    )
}

export default Membership;