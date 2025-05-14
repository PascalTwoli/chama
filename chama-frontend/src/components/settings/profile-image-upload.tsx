import { Toast } from "primereact/toast";
import { useRef, useState } from "react";

function ProfileImageUpload() {
  const toast = useRef<Toast>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.current?.show({
            severity: "error",
            summary: "Invalid file type",
            detail: "Please upload an image file (JPG, PNG, etc.)",
            life: 3000,
        })
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      }
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative flex flex-col items-center cursor-pointer" onClick={handleEditClick}>
      <div className="w-40 h-40 bg-gray-700 border-2 border-gray-600 hover:border-blue-400 transition-all duration-200 rounded-full flex items-center justify-center overflow-hidden"> 
        {selectedImage? (
            <img
                src={selectedImage}
                alt="Uploaded"
                className="object-cover w-full h-full"
            />
        ) : (
            <span>Upload Image</span>
        )}
      </div>
      <input
        id="upload"
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

export default ProfileImageUpload;