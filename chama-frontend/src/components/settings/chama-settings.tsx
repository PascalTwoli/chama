import React, { useRef, useState } from "react";
import { Menu } from "primereact/menu";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
type Role = "Chair" | "Secretary" | "Treasurer"


function ChamaSettings() {
    const toast = useRef<Toast>(null);
    const [activeTab, setActiveTab] = useState("Account");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [roleProfile, setRoleProfile] = useState<Record < Role, string | null>>({
        Chair: null,
        Secretary: null,
        Treasurer: null
    });
    
    const [roleNames, setRoleNames] = useState<Record<Role, string>>({
      Chair: "Agustine",
      Secretary: "Pascal",
      Treasurer: "Daniel",
    });

    const handleNameChange = (role: Role, newName: string) => {
      setRoleNames(prev => ({ ...prev, [role]: newName }));
    };

    const renderRoleProfile = (role: Role) => (
      <div className="flex flex-col items-center gap-2 text-center text-gray-400 p-2">
        <p className="text-lg w-full border-b border-b-2 border-b-gray-500 pb-2 mb-2 font-bold">{role}</p>
        <label htmlFor={`${role}-upload`} className="cursor-pointer">
          <div className="w-36 h-36 bg-gray-800 border-2 border-gray-600 hover:border-blue-400 transition-all duration-200 rounded-full flex items-center justify-center overflow-hidden">
            {roleProfile[role] ? (
              <img
                src={roleProfile[role]!}
                alt={`${role}`}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-sm">{`Upload ${role} Image`}</span>
            )}
          </div>
        </label>
        <input
          id={`${role}-upload`}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleRoleImageUpload(e, role)}
        />
        <InputText
          value={roleNames[role]}
          onChange={(e) => handleNameChange(role, e.target.value)}
          className="text-center text-xl font-semibold text-white bg-transparent border-none rounded"
        />
      </div>
    );
    

    const handleRoleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, role: Role) => {
        const file = event.target.files?.[0];
        if (file) {
          if (!file.type.startsWith("image/")) {
            toast.current?.show({
              severity: "error",
              summary: "Invalid file type",
              detail: "Please upload an image file (JPG, PNG, etc.)",
              life: 3000,
            });
            return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
            setRoleProfile(prev => ({
              ...prev,
              [role]: reader.result as string,
            }));
          };
          reader.readAsDataURL(file);
        }
      };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.current?.show({
                    severity: "error",
                    summary: "Invalid file type",
                    detail: "Please upload an image file (JPG, PNG, etc.)",
                    life: 3000,
                });
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

  const menuItems = [
    {
        label:'Settings',
        items: [
            {
            label: "Account",
            command: () => setActiveTab("Account"),
            },
            {
            label: "Leadership",
            command: () => setActiveTab("Leadership"),
            },
            {
            label: "Danger Zone",
            command: () => setActiveTab("Danger Zone"),
            },
        ]
    }
  ];

  return (
    <>
    <Toast ref={toast}/>
    <h1 className="font-bold text-lg mb-4">Twoli Contribution's Settings</h1>
    <div className="flex gap-3">
        <div className="bg-gray-800 rounded-lg shadow-lg min-w-[220px] overflow-hidden">
          <Menu model={menuItems} className="w-full" pt={{
            root: { className: 'bg-[#242E3B] border-none' },
            menu: { className: 'text-white' },
            menuitem: { className: 'hover:bg-gray-700 transition-colors duration-200' }
          }} />
        </div>

        <div className="flex-1 rounded-lg shadow-lg p-0">
          {activeTab === "Account" && (
            <div className="p-4 bg-[#242E3B] rounded-lg shadow-lg">
              <div className="flex gap-8  pl-4">
                <div className="flex flex-2 flex-col gap-4 flex-1">
                  <div>
                    <label className="block mb-2 font-semibold">Name</label>
                    <InputText placeholder="Chama Name" className="w-full p-inputtext-sm bg-gray-800 border border-gray-600 rounded-md transition-all duration-200 hover:border-blue-400 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold">About</label>
                    <InputTextarea
                      placeholder="Description of the Group"
                      className="w-full p-inputtextarea bg-gray-800 border border-gray-600 rounded-md transition-all duration-200 hover:border-blue-400 focus:border-blue-500"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex flex-2 flex-col items-center justify-center text-center text-gray-400">
                  <label htmlFor="upload" className="cursor-pointer">
                    <div className="w-40 h-40 bg-gray-800 border-2 border-gray-600 hover:border-blue-400 transition-all duration-200 rounded-full flex items-center justify-center overflow-hidden">
                      {selectedImage ? (
                        <img
                          src={selectedImage}
                          alt="Uploaded"
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span>Upload Image</span>
                      )}
                    </div>
                  </label>
                  <input
                    id="upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <span className="mt-2 text-sm">Profile of the Chama</span>
                </div>
              </div>

                <div className="text-right">
                      <Button type="button" label="Update Chama" icon="pi pi-check" className="mt-6 p-button p-button-outlined p-button-info text-[#4084B9] " style={{ width: '12rem', height: '2.5rem' }} />
                </div>
            </div>
          )}

          {activeTab === "Leadership" && (
            <div className=" bg-[#242E3B] rounded-lg shadow-lg">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-3 mt-0 p-3 border-b border-b-2 border-b-gray-500 ">
                        Twoli Contribution Leadership
                    </h2>
                </div>
                <div className="flex grid grid-cols-3 justify-between">
                    {renderRoleProfile("Chair")}
                    {renderRoleProfile("Secretary")}
                    {renderRoleProfile("Treasurer")}
                </div>
            </div>
          )}

          {activeTab === "Danger Zone" && (
            <div className="rounded ">
                <div className="text-center font-bold bg-[#242E3B] rounded-lg shadow-lg px-5 py-3">
                    <h3 className="font-bold text-xl mb-4 pb-2 border-b border-gray-600 mt-0">Reset your chama/group</h3>
                    <div className="text-left text-gray-400">
                        <p> Initiate a fresh start with the removal of all the existing. Please  be aware that the following data will be permanently removed</p>
                        <ul className="ml-10 m-3 list-disc">
                            <li>All active or historical soft loans</li>
                            <li>All accounts, transactions and balances</li>
                            <li>All meetings held, minutes and attendance records</li>
                            <li>Notification log</li>
                        </ul>
                        <p>Only wallet balances will be retained</p>
                        <div className="text-right">
                            <Button icon="pi pi-refresh" className="p-button p-button-warning p-button-outlined mt-4" label="Reset Twoli Contribution's account" style={{ height: '2.5rem' }} />
                        </div>
                    </div>
                </div>

                <div className="font-bold bg-[#242E3B] rounded-lg shadow-lg mt-6 px-5 py-3">
                    <div className="text-center">
                        <h1 className="font-bold text-xl mb-4 pb-2 border-b border-gray-600 mt-0">
                            Delete Chama/Group: Twoli contributions
                        </h1>
                    </div>
                    <div className="text-gray-400">
                        <p>Note: All members will receive notice if this group is deleted. Kindly take note of the following information:</p>
                        <ul className="ml-10 mt-3 list-decimal">
                            <li>Retention perion: You will have six months, until 19 september 2025, to access any group data that is necessary</li>
                            <li className="">Information to be Removed Following Retention Term
                                <ul className="ml-10 m-3 list-disc">
                                    <li >All Active or Historical Soft loans</li>
                                    <li>All accounts, transactions and balances</li>
                                    <li>All meetings held, minutes and attendance records</li>
                                    <li>Notification log</li>
                                    <li>The balance of the group wallet</li>
                                    <li>All balances, accounts, and transactions related to them</li>
                                </ul> 
                            </li>
                            <li>Erreversible action: This data will not be retrieved after the retention term</li>
                        </ul>
                    </div>
                    <div className="text-right">
                        <Button icon="pi pi-trash" className="p-button p-button-danger p-button-outlined mt-4" label="Delete Twoli Contribution's account" style={{ height: '2.5rem' }} />
                    </div>
                </div>
            </div>
          )}
        </div>
    </div>
    </>
  );
}

export default ChamaSettings;