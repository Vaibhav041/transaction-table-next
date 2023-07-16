"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

const Transaction = () => {
  const router = useRouter();
  //children data
  const [data, setData] = useState([]);

  // method to get data and modifying it to the req.
  useEffect(() => {
    const getData = async () => {
      let res = await axios.get(`http://localhost:8080/get-parent-data?parentId=${router.query.parentId}`);
      let temp = res.data.map(item => {
        return {
          ...item,
          sender:router.query.sender,
          reciever:router.query.reciever,
          totalAmount:router.query.totalAmount
        }
      });
      setData(temp);
    }
    getData();
  }, [])
  return (
    <div className='w-full flex justify-center p-10 bg-blue-300 min-h-screen'>
    <div>
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
            data?.map((ele) => {
              return (
                <tr>
                  <td>{ele.id}</td>
                  <td>{ele.sender}</td>
                  <td>{ele.reciever}</td>
                  <td>{ele.totalAmount}</td>
                  <td>{ele.paidAmount}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  </div>  

  )
}

export default Transaction