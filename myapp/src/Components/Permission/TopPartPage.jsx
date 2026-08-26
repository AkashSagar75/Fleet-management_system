import React from "react";
import { getcompaniesrole } from "../../Api/getcompanies/role.api";
import { useState } from "react";
import { useEffect } from "react";


export default function TopPartPage() {
  const [companiesRole, setcompaniesRole] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");

   useEffect(()=>{
   getcompaniesRoleData();
       console.log(companiesRole, "data")
   },[])
   const getcompaniesRoleData =async()=>
    {
 try {
const res = await getcompaniesrole();
 console.log(res, "res")
     setcompaniesRole(res.roles);
        } catch (error) {
 return {
  success: false,
     message: error.response?.data?.message || error.message
  };
 }
    }
 
      const handleChange = (e) => {
    setSelectedCompanyId(e.target.value);
  };
    return (
        <>
            <div className="permissionpage">
                <h2>Permission Management</h2>
                <p>Manages role-based menus and workflows.</p>
                <div className="topRow">
                    <div className="topFilter">
                        <label>Company Code</label>
                        <select className="common-select" value={selectedCompanyId}
                         onChange={handleChange}>
                            {
                         
                            companiesRole.map((data)=>(
                            <option key={data.company_id} value={data.company_id} >{data.company_code}</option>

                            ))
                                 
                            }
                            
                        </select>
                    </div>
                    <div className="topFilter">
                        <label>Company Name</label>

                        <select className="common-select" name="company_name" value={selectedCompanyId} onChange={handleChange} >
                            {companiesRole.map((data)=>(
                            <option key={data.company_id} value={data.company_id}>{data.company_name}</option>
                            ))
                            }
                            
                        </select>
                    </div>
                    <div className="topFilter">
                        <label>Search</label>
                        <input type="text" placeholder="Search" />
                    </div>
                    <div className="topFilter">
                        <button className="btn btn-primary">Save Permission</button>
                    </div>
                </div>
            </div>
        </>
    );
};
