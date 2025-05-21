import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useState } from 'react';
import { ColumnBodyOptions } from 'primereact/column';

// Define interface for member type
interface Member {
    id: number;
    profilepic: string;
    name: string;
    email: string;
    phonenumber: string;
    shares: number;
    actions: string;
}

const profileTemplate = (rowData: Member, options: ColumnBodyOptions) => {
    // Fix image path - assuming public/images directory exists
    const imagePath = rowData.profilepic.startsWith('http') 
        ? rowData.profilepic 
        : `${process.env.PUBLIC_URL || ''}/images${rowData.profilepic.startsWith('/') ? rowData.profilepic : '/' + rowData.profilepic}`;
    
    // Use a default image if the path is invalid
    return (
        <img 
            src={imagePath} 
            alt={`${rowData.name}'s profile`} 
            onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
            }}
            className="w-10 h-10 rounded-full object-cover border border-gray-300" 
        />
    );
};



const actionsTemplate = (rowData: Member, options: ColumnBodyOptions) => (
    <div className="flex gap-2 justify-center">
        <button className="text-blue-500 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-100 transition-colors">
            Edit
        </button>
        <button className="text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-100 transition-colors">
            Delete
        </button>
    </div>
);


function MembersTable () {
    const [members, setMembers] = useState<Member[]>([]);

    // Define columns with proper field mappings and formatters
    const columns = [
        {field: 'profilepic', header: 'Profile', width: '10%', body: profileTemplate},
        {field: 'name', header: 'Name', width: '20%'},
        {field: 'email', header: 'E-mail', width: '20%'},
        {field: 'phonenumber', header: 'Phone Number', width: '15%'},
        {field: 'shares', header: 'Shares', width: '15%'},
        {field: 'actions', header: 'Actions', width: '20%', body: actionsTemplate},
    ]

    

    // test data
    useEffect (() => {
        const mockData = [
            {
                id: 1,
                profilepic: '/avatar1.png', // Updated path - will be resolved by the template function
                name: 'Alice Wanjiru',
                email: 'alice@example.com',
                phonenumber: '0712345678',
                shares: 100,
                actions: 'Edit/Delete'
            },
            {
                id: 2,
                profilepic: '/avatar2.png', // Updated path
                name: 'Brian Otieno',
                email: 'brian@example.com',
                phonenumber: '0798765432',
                shares: 80,
                actions: 'Edit/Delete'
            },
            {
                id: 1,
                profilepic: '/avatar1.png',
                name: 'Alice Wanjiru',
                email: 'alice@example.com',
                phonenumber: '0712345678',
                shares: 100,
                actions: 'Edit/Delete'
            },
            {
                id: 2,
                profilepic: '/avatar2.png',
                name: 'Brian Otieno',
                email: 'brian@example.com',
                phonenumber: '0798765432',
                shares: 80,
                actions: 'Edit/Delete'
            },
            {
                id: 1,
                profilepic: '/avatar1.png',
                name: 'Alice Wanjiru',
                email: 'alice@example.com',
                phonenumber: '0712345678',
                shares: 100,
                actions: 'Edit/Delete'
            },
            {
                id: 2,
                profilepic: '/avatar2.png',
                name: 'Brian Otieno',
                email: 'brian@example.com',
                phonenumber: '0798765432',
                shares: 80,
                actions: 'Edit/Delete'
            },
            {
                id: 1,
                profilepic: '/avatar1.png',
                name: 'Alice Wanjiru',
                email: 'alice@example.com',
                phonenumber: '0712345678',
                shares: 100,
                actions: 'Edit/Delete'
            },
            {
                id: 2,
                profilepic: '/avatar2.png',
                name: 'Brian Otieno',
                email: 'brian@example.com',
                phonenumber: '0798765432',
                shares: 80,
                actions: 'Edit/Delete'
            },
            {
                id: 1,
                profilepic: '/avatar1.png',
                name: 'Alice Wanjiru',
                email: 'alice@example.com',
                phonenumber: '0712345678',
                shares: 100,
                actions: 'Edit/Delete'
            },
            {
                id: 2,
                profilepic: '/avatar2.png',
                name: 'Brian Otieno',
                email: 'brian@example.com',
                phonenumber: '0798765432',
                shares: 80,
                actions: 'Edit/Delete'
            },
            {
                id: 1,
                profilepic: '/avatar1.png',
                name: 'Alice Wanjiru',
                email: 'alice@example.com',
                phonenumber: '0712345678',
                shares: 100,
                actions: 'Edit/Delete'
            },
            {
                id: 2,
                profilepic: '/avatar2.png',
                name: 'Brian Otieno',
                email: 'brian@example.com',
                phonenumber: '0798765432',
                shares: 80,
                actions: 'Edit/Delete'
            },
            {
                id: 1,
                profilepic: '/avatar1.png',
                name: 'Alice Wanjiru',
                email: 'alice@example.com',
                phonenumber: '0712345678',
                shares: 100,
                actions: 'Edit/Delete'
            },
            {
                id: 2,
                profilepic: '/avatar2.png',
                name: 'Brian Otieno',
                email: 'brian@example.com',
                phonenumber: '0798765432',
                shares: 80,
                actions: 'Edit/Delete'
            },
            {
                id: 1,
                profilepic: '/avatar1.png',
                name: 'Alice Wanjiru',
                email: 'alice@example.com',
                phonenumber: '0712345678',
                shares: 100,
                actions: 'Edit/Delete'
            },
            {
                id: 2,
                profilepic: '/avatar2.png',
                name: 'Brian Otieno',
                email: 'brian@example.com',
                phonenumber: '0798765432',
                shares: 80,
                actions: 'Edit/Delete'
            },
            {
                id: 1,
                profilepic: '/avatar1.png',
                name: 'Alice Wanjiru',
                email: 'alice@example.com',
                phonenumber: '0712345678',
                shares: 100,
                actions: 'Edit/Delete'
            },
            {
                id: 2,
                profilepic: '/avatar2.png',
                name: 'Brian Otieno',
                email: 'brian@example.com',
                phonenumber: '0798765432',
                shares: 80,
                actions: 'Edit/Delete'
            },
            {
                id: 1,
                profilepic: '/avatar1.png',
                name: 'Alice Wanjiru',
                email: 'alice@example.com',
                phonenumber: '0712345678',
                shares: 100,
                actions: 'Edit/Delete'
            },
            {
                id: 2,
                profilepic: '/avatar2.png',
                name: 'Brian Otieno',
                email: 'brian@example.com',
                phonenumber: '0798765432',
                shares: 80,
                actions: 'Edit/Delete'
            },            
            {
                id: 1,
                profilepic: '/avatar1.png',
                name: 'Alice Wanjiru',
                email: 'alice@example.com',
                phonenumber: '0712345678',
                shares: 100,
                actions: 'Edit/Delete'
            },
            {
                id: 2,
                profilepic: '/avatar2.png',
                name: 'Brian Otieno',
                email: 'brian@example.com',
                phonenumber: '0798765432',
                shares: 80,
                actions: 'Edit/Delete'
            },            
            {
                id: 1,
                profilepic: '/avatar1.png',
                name: 'Alice Wanjiru',
                email: 'alice@example.com',
                phonenumber: '0712345678',
                shares: 100,
                actions: 'Edit/Delete'
            },
            {
                id: 2,
                profilepic: '/avatar2.png',
                name: 'Brian Otieno',
                email: 'brian@example.com',
                phonenumber: '0798765432',
                shares: 80,
                actions: 'Edit/Delete'
            }
        ];
        setMembers(mockData);
    }, [])

    // Log current members state before rendering
    console.log('Current members state before rendering:', members);
    
    return (
        <div className="card shadow-sm rounded-lg ">
            <h2 className="text-xl font-semibold mb-4">Members List</h2>
            <DataTable 
                value={members} 
                paginator 
                rows={10} 
                rowsPerPageOptions={[5, 10, 25, 50]} 
                tableStyle={{ minWidth: '50rem' }}
                stripedRows
                emptyMessage="No members found"
                className="p-datatable-sm"
            >
                {columns.map((col) => (
                    <Column 
                        key={col.field} 
                        field={col.field} 
                        header={col.header} 
                        style={{width: col.width}} 
                        body={col.body}
                    />
                ))}
            </DataTable>
        </div>
    )
}

export default MembersTable;