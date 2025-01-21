import userModel from './UserSchema.js'


//to create user
export const createUser = (userobj)=>{
    return userModel(userobj).save();
}

//read user

export const getUserByEmail=(email)=>{
    return userModel.findOne({email});
}

