const Role = require("./../Models/role");
const { Op } = require("sequelize");

exports.create = async (req, res) => {
    try{
        const {role} = req.body;

        if(!role){
            return res.status(400).json({status : false, message : "Role is imvalid!"})
        }

        const existData = await Role.findOne({where : {roleName : role}});

        if(existData){
            return res.status(400).json({status : false, message : "This role already exist!"})
        }

        const data = await Role.create({roleName : role});

        res.status(200).json({status : true, message : "add sucessfull", data})

    }catch(err){
        res.status(500).json({status : false, message : "server issues"})
    }
}

exports.getAll = async (req, res) => {
    try{
        const data = await Role.findAll();
        
        if(data.length === 0){
            return res.status(404).json({status : false, message : "no data found"})
        }

        res.status(200).json({status : true, message : "Data retrive sucessful", data : data})
    }catch(err){
        res.status(500).json({staus : false, message : "Server error", error : err})
    }
}

exports.getById = async (req, res) => {
    try{
        const {id} = req.params;
        const data = await Role.findByPk(id);
        
        if(data.length === 0){
            return res.status(404).json({status : false, message : "no data found"})
        }

        res.status(200).json({status : true, message : "Data retrive sucessful", data : data})
    }catch(err){
        res.status(500).json({staus : false, message : "Server error", error : err})
    }
}

exports.update = async (req, res) => {
    try{
        const {role} = req.body;
        const {id} = req.params;

        if(!role){
            return res.status(400).json({status : false, message : "Role is imvalid!"})
        }

        const existData = await Role.findByPk(id);
        if(!existData){
            return res.status(400).json({status : false, message : "This role not found!"})
        }

        const duplicate = await Role.findOne({
            where : {
                roleName : role,
                id : {[Op.ne] : id}
            }
        });

        if(duplicate){
            return res.status(400).json({status : false, message : "This role already exists!"})
        }

        existData.roleName = role;
        existData.save();

        res.status(200).json({status : true, message : "update sucessfull", data : existData})

    }catch(err){
        res.status(500).json({status : false, message : "server issues"})
    }
}

exports.delete = async (req, res) => {
    try{
        const {id} = req.params;
        const data = await Role.findByPk(id);
        
        if(data.length === 0){
            return res.status(404).json({status : false, message : "no data found"})
        }

        await data.destroy();

        res.status(200).json({status : true, message : "Data delete sucessful", data : data})
    }catch(err){
        res.status(500).json({staus : false, message : "Server error", error : err})
    }
}