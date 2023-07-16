import axios from 'axios'
import { useEffect, useState } from 'react'
import Link from 'next/link'


export default function Home() {
  // state for pagination
  const [page, setPage] = useState(1);
  // state to store parent data
  const [parentData, setParentData] = useState([]);

  // will get pareent data and modify it according to the requirement
  const getData = async() => {
    let res = await axios.get(`http://localhost:8080/getdata?page=${page}`);

    // calculating totalPaid amount by the children
    const child1 = await axios.get(`http://localhost:8080/get-parent-data?parentId=${res.data[0].id}`);
    let child1Cost = child1.data.reduce((acc, ele) => acc + ele.paidAmount, 0);
    if (res.data.length === 1) {
      setParentData([
        {...res.data[0], totalCost:child1Cost},
      ]);
      return;
    }
    const child2 = await axios.get(`http://localhost:8080/get-parent-data?parentId=${res.data[1].id}`);    
    let child2Cost = child2.data.reduce((acc, ele) => acc + ele.paidAmount, 0);
    setParentData([
      {...res.data[0], totalCost:child1Cost},
      {...res.data[1], totalCost:child2Cost}
    ]);
  }
  useEffect(() => {
    getData();
  }, [page]);

  console.log(parentData, "paremnt");
  return (
    <div className='w-full flex justify-center p-10 bg-blue-300 min-h-screen'>
      <div>
        //table showing the intended data.
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Sender</th>
              <th>Reciever</th>
              <th>Total Amount</th>
              <th>Total Paid Amount</th>
            </tr>
          </thead>
          <tbody>
            {
              parentData?.map((ele) => {
                return (
                  <tr>
                    <td>{ele.id}</td>
                    <td>{ele.sender}</td>
                    <td>{ele.receiver}</td>
                    <td>{ele.totalAmount}</td>
                    //sending user to the transaction page to see the transaction of the particular sender reciever pair
                    <td><Link href={`/transaction?parentId=${ele.id}&sender=${ele.sender}&reciever=${ele.receiver}&totalAmount=${ele.totalAmount}`}>{ele.totalCost}</Link></td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
        <div className='flex justify-between mt-5'>
          <button disabled={page === 1} className='bg-blue-900 px-3 py-1 rounded-md text-white font-semibold text-lg disabled:cursor-not-allowed' onClick={() => setPage(prev => prev-1)}>prev</button>
          <button disabled={page === 4} className='bg-blue-900 px-3 py-1 rounded-md text-white font-semibold text-lg disabled:cursor-not-allowed' onClick={() => setPage(prev => prev+1)}>Next</button>
        </div>
      </div>
    </div>  
  )
}