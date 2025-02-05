import { getServerSession } from "next-auth";
import {authOptions} from "../auth/[...nextauth]/options"
import { Session } from "next-auth";
import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/model/user";

import { User } from "next-auth";

export async function POST(request:Request){
    await dbConnect()
    const session : Session | null =await getServerSession(authOptions)
    const user:User= session?.user
   

    if(!session  || !session.user){
        return  Response.json({
            success:false,
            message:"Not Authenticated"},{status:401 })
    }

    const userId=user._id

    const {acceptMessages}=await request.json()

    try{
        const updateUser=await UserModel.findByIdAndUpdate(userId,{isAcceptingMessages:acceptMessages},{new:true})
    if(!updateUser){
        return Response.json({
            success:false,
            message:"Failed to update user as no user found "
        },{status:400})
    }

    return Response.json({
        success:true,
        message:"Message acceptance status updated successfully",
        updateUser
    },{status:200})
    
    
    
    }
    catch(error){
        console.log("failed to update user status to accept messages",error)
        return Response.json({
            success:false,
            message:"Failed to update user status to accept messages"
        },{status:401})
    }


     

}






export async function GET(){
    await dbConnect()
    const session=await getServerSession(authOptions)
    const user:User= session?.user

    if(!session || !session.user){
        return  Response.json({
            success:false,
            message:"Not Authenticated"
        },{
            status:401 })
    }

    const userId=user._id

    try{
    const foundUser=await UserModel.findById(userId)

    if(!foundUser){
        return Response.json({
            success:false,
            message:"Failed to get user as no user found "
        },{status:404})
    }

    return Response.json({
        success:true,
        message:"Message acceptance status got successfully",
        isAcceptingMessages:foundUser.isAcceptingMessages
    },{status:200})
    
    
    
    }
    catch(error){
        console.log("failed to get user status to accept messages",error)
        return Response.json({
            success:false,
            message:"Failed to get user status to accept messages"
        },{status:401})
    }



}