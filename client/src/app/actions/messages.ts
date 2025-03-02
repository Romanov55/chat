'use server'

import axios from 'axios';

export async function getMessages(sender: string, receiver: string) {
  try {
    const { data } = await axios.get("http://localhost:4000/api/message", { 
      params: { 
        sender, 
        receiver 
      }
    });

    return data;
  } catch (error: unknown) {
    console.log(error);
  }
}
