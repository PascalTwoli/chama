import { toast } from 'react-toastify';
import { useRef, useState, type Dispatch, type SetStateAction } from "react";

interface ProfileImageUploadProps {
  onStartEditing: () => void;
  isParentEditing: boolean;
}

function ProfileImageUpload({ onStartEditing, isParentEditing }: ProfileImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload an image file (JPG, PNG, etc.)");
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
    if (!isParentEditing) return; // Do nothing if parent is not in editing mode
    fileInputRef.current?.click();
    onStartEditing(); // Notify parent to enter editing mode
  };

  return (
    <>
      <div
        className={`relative flex flex-col items-center `}
        onClick={handleEditClick}
      >
        <div className={`w-40 h-40 bg-gray-800 transition-all duration-200 rounded-full flex items-center justify-center overflow-hidden ${isParentEditing ? 'cursor-pointer profileEditing' : 'cursor-not-allowed opacity-90'} `}> 
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
    </>
  );
}

export default ProfileImageUpload;