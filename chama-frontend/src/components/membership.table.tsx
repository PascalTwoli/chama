import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useState } from 'react';
import { ColumnBodyOptions } from 'primereact/column';
import { classNames } from 'primereact/utils';

// Define interface for member type
interface Member {
  id: number;
  // profilepic: string;
  name: string;
  role: string;
  phonenumber: string;
  status: string;
  actions: string;
}

// const profileTemplate = (rowData: Member, options: ColumnBodyOptions) => {
//   // Fix image path - assuming public/images directory exists
//   const imagePath = rowData.profilepic.startsWith('http')
//     ? rowData.profilepic
//     : `${process.env.PUBLIC_URL || ''}/images${rowData.profilepic.startsWith('/') ? rowData.profilepic : '/' + rowData.profilepic}`;

//   // Use a default image if the path is invalid
//   return (
//     <img
//       src={imagePath}
//       alt={`${rowData.name}'s profile`}
//       onError={e => {
//         (e.target as HTMLImageElement).src =
//           'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
//       }}
//       className='w-10 h-10 rounded-full object-cover border border-gray-300'
//     />
//   );
// };

const actionsTemplate = (rowData: Member, options: ColumnBodyOptions) => (
  <div className='flex gap-2 '>
    <button className='text-secondary bg-transparent font-bold cursor-pointer border-none hover:text-secondary1 px-2 py-1 transition-colors'>
      View
    </button>
  </div>
);

const statusTemp = (rowData: Member, options: ColumnBodyOptions) => (
  <span
    className={`px-3 py-2 rounded-full text-xs font-semibold ${
      rowData.status === 'Active'
        ? 'bg-success/20 text-success'
        : rowData.status === 'Inactive'
          ? 'bg-accent/20 text-accent'
          : 'bg-muted text-muted-foreground'
    }`}
  >
    {rowData.status}
  </span>
);

function MembersTable() {
  const [members, setMembers] = useState<Member[]>([]);

  // Define columns with proper field mappings and formatters
  const columns = [
    // {
    //   field: 'profilepic',
    //   header: 'Profile',
    //   width: '10%',
    //   body: profileTemplate,
    // },
    {
      field: 'name',
      header: 'Name',
      width: '20%',
      className: 'text-default',
    },
    {
      field: 'role',
      header: 'Role',
      width: '20%',
      className: 'text-muted-foreground',
    },
    {
      field: 'phonenumber',
      header: 'Phone Number',
      width: '20%',
      className: 'text-default',
    },
    { field: 'status', header: 'Status', width: '20%', body: statusTemp },
    {
      field: 'actions',
      header: 'Actions',
      width: '20%',
      body: actionsTemplate,
    },
  ];

  // test data
  useEffect(() => {
    const mockData = [
      {
        id: 1,
        // profilepic: '/signinimage.png', // Updated path - will be resolved by the template function
        name: 'Alice Wanjiru',
        role: 'chair',
        phonenumber: '0712345678',
        status: 'Active',
        actions: 'Edit/Delete',
      },
      {
        id: 2,
        // profilepic: '/avatar2.png', // Updated path
        name: 'Brian Otieno',
        role: 'secretary',
        phonenumber: '0798765432',
        status: 'Active',
        actions: 'Edit/Delete',
      },
      {
        id: 1,
        // profilepic: '/avatar1.png',
        name: 'Alice Wanjiru',
        role: 'treasurer',
        phonenumber: '0712345678',
        status: 'Active',
        actions: 'Edit/Delete',
      },
      {
        id: 2,
        // profilepic: '/avatar2.png',
        name: 'Brian Otieno',
        role: 'member',
        phonenumber: '0798765432',
        status: 'Inactive',
        actions: 'Edit/Delete',
      },
      {
        id: 1,
        // profilepic: '/avatar1.png',
        name: 'Alice Wanjiru',
        role: 'member',
        phonenumber: '0712345678',
        status: 'Active',
        actions: 'Edit/Delete',
      },
      {
        id: 2,
        // profilepic: '/avatar2.png',
        name: 'Brian Otieno',
        role: 'member',
        phonenumber: '0798765432',
        status: 'Active',
        actions: 'Edit/Delete',
      },
      {
        id: 1,
        // profilepic: '/avatar1.png',
        name: 'Alice Wanjiru',
        role: 'member',
        phonenumber: '0712345678',
        status: 'Active',
        actions: 'Edit/Delete',
      },
      {
        id: 2,
        // profilepic: '/avatar2.png',
        name: 'Brian Otieno',
        role: 'member',
        phonenumber: '0798765432',
        status: 'Active',
        actions: 'Edit/Delete',
      },
      {
        id: 1,
        // profilepic: '/avatar1.png',
        name: 'Alice Wanjiru',
        role: 'member',
        phonenumber: '0712345678',
        status: 'Inactive',
        actions: 'Edit/Delete',
      },
      {
        id: 2,
        // profilepic: '/avatar2.png',
        name: 'Brian Otieno',
        role: 'member',
        phonenumber: '0798765432',
        status: 'Active',
        actions: 'Edit/Delete',
      },
      {
        id: 1,
        // profilepic: '/avatar1.png',
        name: 'Alice Wanjiru',
        role: 'member',
        phonenumber: '0712345678',
        status: 'Active',
        actions: 'Edit/Delete',
      },
      {
        id: 2,
        // profilepic: '/avatar2.png',
        name: 'Brian Otieno',
        role: 'member',
        phonenumber: '0798765432',
        status: 'Inactive',
        actions: 'Edit/Delete',
      },
      {
        id: 1,
        // profilepic: '/avatar1.png',
        name: 'Alice Wanjiru',
        role: 'member',
        phonenumber: '0712345678',
        status: 'Inactive',
        actions: 'Edit/Delete',
      },
      {
        id: 2,
        // profilepic: '/avatar2.png',
        name: 'Brian Otieno',
        role: 'member',
        phonenumber: '0798765432',
        status: 'Active',
        actions: 'Edit/Delete',
      },
      {
        id: 1,
        // profilepic: '/avatar1.png',
        name: 'Alice Wanjiru',
        role: 'member',
        phonenumber: '0712345678',
        status: 'Inactive',
        actions: 'Edit/Delete',
      },
      {
        id: 2,
        // profilepic: '/avatar2.png',
        name: 'Brian Otieno',
        role: 'member',
        phonenumber: '0798765432',
        status: 'Inactive',
        actions: 'Edit/Delete',
      },
      {
        id: 1,
        // profilepic: '/avatar1.png',
        name: 'Alice Wanjiru',
        role: 'member',
        phonenumber: '0712345678',
        status: 'Inactive',
        actions: 'Edit/Delete',
      },
      {
        id: 2,
        // profilepic: '/avatar2.png',
        name: 'Brian Otieno',
        role: 'member',
        phonenumber: '0798765432',
        status: 'Inactive',
        actions: 'Edit/Delete',
      },
      {
        id: 1,
        // profilepic: '/avatar1.png',
        name: 'Alice Wanjiru',
        role: 'member',
        phonenumber: '0712345678',
        status: 'Active',
        actions: 'Edit/Delete',
      },
      {
        id: 2,
        // profilepic: '/avatar2.png',
        name: 'Brian Otieno',
        role: 'member',
        phonenumber: '0798765432',
        status: 'Active',
        actions: 'Edit/Delete',
      },
      {
        id: 1,
        // profilepic: '/avatar1.png',
        name: 'Alice Wanjiru',
        role: 'member',
        phonenumber: '0712345678',
        status: 'Active',
        actions: 'Edit/Delete',
      },
      {
        id: 2,
        // profilepic: '/avatar2.png',
        name: 'Brian Otieno',
        role: 'member',
        phonenumber: '0798765432',
        status: 'Active',
        actions: 'Edit/Delete',
      },
      {
        id: 1,
        // profilepic: '/avatar1.png',
        name: 'Alice Wanjiru',
        role: 'member',
        phonenumber: '0712345678',
        status: 'Enactive',
        actions: 'Edit/Delete',
      },
      {
        id: 2,
        // profilepic: '/avatar2.png',
        name: 'Brian Otieno',
        role: 'member',
        phonenumber: '0798765432',
        status: 'Active',
        actions: 'Edit/Delete',
      },
    ];
    setMembers(mockData);
  }, []);

  // Log current members state before rendering
  console.log('Current members state before rendering:', members);

  return (
    <div className='card shadow-sm rounded-lg bg-transparent'>
      <DataTable
        value={members}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: '50rem' }}
        emptyMessage='No members found'
        className=''
      >
        {columns.map(col => (
          <Column
            key={col.field}
            field={col.field}
            header={col.header}
            style={{ width: col.width }}
            body={col.body}
            className={col.className}
          />
        ))}
      </DataTable>
    </div>
  );
}

export default MembersTable;
