import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useState } from 'react';
import { ColumnBodyOptions } from 'primereact/column';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'primereact/button';

const profileTemplate = (rowData: any, options: ColumnBodyOptions) => {
    <img src={rowData.profilepic} alt="profile" className="w-10 h-10 rounded-full" />
};

const actionsTemplate = (rowData: any, options: ColumnBodyOptions) => (
    <div className="flex gap-2">
        <button className="text-blue-500">Edit</button>
        <button className="text-red-500">Delete</button>
    </div>
);

const ChamaListView = ()  => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [members, setMembers] = useState([]);

    const columns = [
        {field: 'profilepic', header: '#', width: '15%'},
        {field: 'name', header: 'Name', width: '20%'},
        {field: 'email', header: 'E-mail', width: '20%'},
        {field: 'phonenumber', header: 'Phone Number', width: '15%'},
        {field: 'shares', header: 'Share', width: '15%'},
        {field: 'actions', header: 'Actions', width: '15%'},
    ]

    const chamaId = useParams().chamaId;

                // test data
                useEffect (() => {
                    const mockData = [
                        {
                            id: 1,
                            profilepic: '/assets/avatar1.png',
                            name: 'Alice Wanjiru',
                            email: 'alice@example.com',
                            phonenumber: '0712345678',
                            shares: 100,
                            actions: 'Edit/Delete'
                        },
                        {
                            id: 2,
                            profilepic: '/assets/avatar2.png',
                            name: 'Brian Otieno',
                            email: 'brian@example.com',
                            phonenumber: '0798765432',
                            shares: 80,
                            actions: 'Edit/Delete'
                        },
                        {
                            id: 1,
                            profilepic: '/assets/avatar1.png',
                            name: 'Alice Wanjiru',
                            email: 'alice@example.com',
                            phonenumber: '0712345678',
                            shares: 100,
                            actions: 'Edit/Delete'
                        },
                        {
                            id: 2,
                            profilepic: '/assets/avatar2.png',
                            name: 'Brian Otieno',
                            email: 'brian@example.com',
                            phonenumber: '0798765432',
                            shares: 80,
                            actions: 'Edit/Delete'
                        },
                        {
                            id: 1,
                            profilepic: '/assets/avatar1.png',
                            name: 'Alice Wanjiru',
                            email: 'alice@example.com',
                            phonenumber: '0712345678',
                            shares: 100,
                            actions: 'Edit/Delete'
                        },
                        {
                            id: 2,
                            profilepic: '/assets/avatar2.png',
                            name: 'Brian Otieno',
                            email: 'brian@example.com',
                            phonenumber: '0798765432',
                            shares: 80,
                            actions: 'Edit/Delete'
                        },
                        {
                            id: 1,
                            profilepic: '/assets/avatar1.png',
                            name: 'Alice Wanjiru',
                            email: 'alice@example.com',
                            phonenumber: '0712345678',
                            shares: 100,
                            actions: 'Edit/Delete'
                        },
                        {
                            id: 2,
                            profilepic: '/assets/avatar2.png',
                            name: 'Brian Otieno',
                            email: 'brian@example.com',
                            phonenumber: '0798765432',
                            shares: 80,
                            actions: 'Edit/Delete'
                        },
                        {
                            id: 1,
                            profilepic: '/assets/avatar1.png',
                            name: 'Alice Wanjiru',
                            email: 'alice@example.com',
                            phonenumber: '0712345678',
                            shares: 100,
                            actions: 'Edit/Delete'
                        },
                        {
                            id: 2,
                            profilepic: '/assets/avatar2.png',
                            name: 'Brian Otieno',
                            email: 'brian@example.com',
                            phonenumber: '0798765432',
                            shares: 80,
                            actions: 'Edit/Delete'
                        },
                        {
                            id: 1,
                            profilepic: '/assets/avatar1.png',
                            name: 'Alice Wanjiru',
                            email: 'alice@example.com',
                            phonenumber: '0712345678',
                            shares: 100,
                            actions: 'Edit/Delete'
                        },
                        {
                            id: 2,
                            profilepic: '/assets/avatar2.png',
                            name: 'Brian Otieno',
                            email: 'brian@example.com',
                            phonenumber: '0798765432',
                            shares: 80,
                            actions: 'Edit/Delete'
                        },
                        {
                            id: 1,
                            profilepic: '/assets/avatar1.png',
                            name: 'Alice Wanjiru',
                            email: 'alice@example.com',
                            phonenumber: '0712345678',
                            shares: 100,
                            actions: 'Edit/Delete'
                        },
                        {
                            id: 2,
                            profilepic: '/assets/avatar2.png',
                            name: 'Brian Otieno',
                            email: 'brian@example.com',
                            phonenumber: '0798765432',
                            shares: 80,
                            actions: 'Edit/Delete'
                        },
                        {
                            id: 1,
                            profilepic: '/assets/avatar1.png',
                            name: 'Alice Wanjiru',
                            email: 'alice@example.com',
                            phonenumber: '0712345678',
                            shares: 100,
                            actions: 'Edit/Delete'
                        },
                        {
                            id: 2,
                            profilepic: '/assets/avatar2.png',
                            name: 'Brian Otieno',
                            email: 'brian@example.com',
                            phonenumber: '0798765432',
                            shares: 80,
                            actions: 'Edit/Delete'
                        },
                        {
                            id: 1,
                            profilepic: '/assets/avatar1.png',
                            name: 'Alice Wanjiru',
                            email: 'alice@example.com',
                            phonenumber: '0712345678',
                            shares: 100,
                            actions: 'Edit/Delete'
                        },
                        {
                            id: 2,
                            profilepic: '/assets/avatar2.png',
                            name: 'Brian Otieno',
                            email: 'brian@example.com',
                            phonenumber: '0798765432',
                            shares: 80,
                            actions: 'Edit/Delete'
                        },
                        {
                            id: 1,
                            profilepic: '/assets/avatar1.png',
                            name: 'Alice Wanjiru',
                            email: 'alice@example.com',
                            phonenumber: '0712345678',
                            shares: 100,
                            actions: 'Edit/Delete'
                        },
                        {
                            id: 2,
                            profilepic: '/assets/avatar2.png',
                            name: 'Brian Otieno',
                            email: 'brian@example.com',
                            phonenumber: '0798765432',
                            shares: 80,
                            actions: 'Edit/Delete'
                        },            
                        {
                            id: 1,
                            profilepic: '/assets/avatar1.png',
                            name: 'Alice Wanjiru',
                            email: 'alice@example.com',
                            phonenumber: '0712345678',
                            shares: 100,
                            actions: 'Edit/Delete'
                        },
                        {
                            id: 2,
                            profilepic: '/assets/avatar2.png',
                            name: 'Brian Otieno',
                            email: 'brian@example.com',
                            phonenumber: '0798765432',
                            shares: 80,
                            actions: 'Edit/Delete'
                        },            
                        {
                            id: 1,
                            profilepic: '/assets/avatar1.png',
                            name: 'Alice Wanjiru',
                            email: 'alice@example.com',
                            phonenumber: '0712345678',
                            shares: 100,
                            actions: 'Edit/Delete'
                        },
                        {
                            id: 2,
                            profilepic: '/assets/avatar2.png',
                            name: 'Brian Otieno',
                            email: 'brian@example.com',
                            phonenumber: '0798765432',
                            shares: 80,
                            actions: 'Edit/Delete'
                        }
                    ];
            
                    setMembers (mockData => mockData) 
                }, [])
    return (
        <>
            <div className="card">
                    <DataTable value={members} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}>
                        {columns.map((col) => (
                            <Column 
                                key={col.field} 
                                field={col.field} 
                                header={col.header} 
                                style={{width: col.width, padding: '2px 0'}} 
                                // body={col.field === 'profilepic' ? profileTemplate : col.field === 'actions' ? actionsTemplate : undefined }
                            />
                        ))}
                    </DataTable>
                </div>

            <div className='mt-10 flex justify-end'>
                <Button className="p-button-success" onClick={
                    () => navigate(`/chama/${chamaId}/join`)
                    
                    }>
                    Join Chama {chamaId}
                </Button>
            </div>
        </>
    )
}

export default ChamaListView;