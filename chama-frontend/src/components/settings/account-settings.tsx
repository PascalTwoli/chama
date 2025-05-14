

import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import ProfileImageUpload from "./profile-image-upload";

export default function AccountSettings() {
  const [form, setForm] = useState({
    firstName: "Agustine",
    lastName: "Twoli",
    otherNames: "Nambia",
    email: "agustinetwoli@gmail.com",
    phone: "0797039877",
    gender: "Male",
    about: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="px-6 text-gray-100">
      <h2 className="text-xl font-bold mb-4 mt-0">Augustine Twoli’s profile</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Profile Panel */}
        <div className="bg-[#242E3B] rounded-xl p-6 flex flex-col items-center">
          <div className="w-full flex justify-between items-center">
            <h3 className="text-lg text-gray-300 font-bold mb-4">Profile Details</h3>
            <Button className="w-14  text-gray-200 hover:border hover:border-gray-400 p-2 rounded-xl hover:bg-gray-700 transition-all p-button-info p-button-outlined mt-4">
              <i className="pi pi-pencil text-xl" />
            </Button>
          </div>
          {/* <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-700 shadow-md mb-4">
            <img src="/assets/chamaprofileimage.png" alt="Profile" className="object-cover w-full h-full" />
          </div> */}
          <ProfileImageUpload/>
          <p className="text-center font-bold text-white">{`${form.firstName} ${form.lastName}`}</p>
        </div>

        {/* Account Form */}
        <div className="md:col-span-2 bg-[#242E3B] font-bold text-gray-400 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-6">Account</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium text-sm">First Name:<span className="text-red-500">*</span></label>
              <InputText
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-sm">Last Name:<span className="text-red-500">*</span></label>
              <InputText
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-sm">Other Names:</label>
              <InputText
                name="otherNames"
                value={form.otherNames}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-sm">Gender:<span className="text-red-500">*</span></label>
              <InputText
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-sm">E-mail Address:<span className="text-red-500">*</span></label>
              <InputText
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-sm">Phone Number:<span className="text-red-500">*</span></label>
              <InputText
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1 font-medium text-sm">About you</label>
              <InputTextarea
                name="about"
                value={form.about}
                onChange={handleChange}
                rows={4}
                className="w-full"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button label="Save changes" className="bg-[#4084B9] border-[#4084B9] px-6 py-2 font-normal" />
          </div>
        </div>
      </div>
    </div>
  );
}