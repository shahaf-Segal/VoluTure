const { Employee } = require('../models/employee.model')
const bcrypt = require("bcryptjs")
const { generateToken } = require('../utils/jwt')

const getEmployees = async (req, res) => {
    try {
        const query =  req.query
        const employee = await Employee.find({...query})
        res.send(employee)
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getEmployee =  async(req,res)=>{
    try{
        const {role}=req.employee
        const link = await Employee.findById(req.employee.id)
        res.send({
            link:{...link._doc,role}
        })
    }
    catch(err){
        res.status(400).send("cannot find")
    }
}

const Register = async (req, res) => {
    try {
        const body = req.body;
        const hash = await bcrypt.hash(body.password, 10);
        body.password = hash;
        const employee = new Employee(body);
        employee.id = employee._id;
        await employee.save();
        res.status(200).send(employee);
    } catch (err) {
        res.status(400).send("Error");
    }
};

const Login = async (req, res) =>{
    const {email, password} = req.body;
    try{
        const employee = await Employee.findOne({email})
        if(employee){
        const isMatch = await bcrypt.compare(password, employee.password)
        if(isMatch){
            const token = generateToken({id: employee._id ,email: employee.email, role: "employee"})
        return res.send({employee, token});
    } 
    return res.status(401).send("Email or password are incorrect");
    };
    return res.status(401).send("Email or password are incorrect");
    }
    catch(err){
        res.status(400).send("Cannot Log in")
    }
}

const updateEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const updatedEmployee = await Employee.findByIdAndUpdate(employeeId, req.body, { new: true });
        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const deletedEmployee = await Employee.findByIdAndDelete(employeeId);
        if (!deletedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


module.exports = {Register, Login, getEmployees, deleteEmployee, updateEmployee, getEmployee};
