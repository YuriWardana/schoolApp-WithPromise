const pool = require('../setup/connection')

class Student{
    constructor(id,first_name,last_name,email,gender,birthdate){
        this.id = id
        this.first_name = first_name
        this.last_name = last_name
        this.email = email
        this.gender = gender
        this.birthdate = birthdate

    }
}  

class StudentModel{

    static read(){

        let query = `select * from "Students"`
        return pool.query(query)
        .then (data => {
            const newData = data.rows.map(el =>{
              return  new Student(el.id, el.first_name, el.last_name, el.email, el.gender, el.birthdate)
            })
            return newData
        })
        .catch(err => console.log(err.stack))
    }


    static addData(data){
        let alert = this.validation(data) 

        if(alert.length > 0){
            return alert
        }else{
            let {first_name, last_name,email,gender,birthdate} = data
            let query = `
            insert into "Students" ("first_name" , "last_name", "email", "gender", "birthdate")
            values ($1,$2,$3,$4,$5) returning *`
            
            let values = [first_name, last_name,email,gender,birthdate]
            
            return pool.query(query,values)
            .then(data => {
                let newData = data.rows.map(el =>{
                    return new Student(el.id, el.first_name, el.last_name, el.email,el.gender, el.birthdate)
                })
                return newData
            })
            .catch(err => console.log(err))
        }
    }
            
           
        
    static getId(id){
       
        let query = `select * from "Students" where id = $1`
        let values = [id]

        return pool.query(query,values)
        .then(data =>{
            let id = data.rows[0].id
            let first_name = data.rows[0].first_name
            let last_name = data.rows[0].last_name
            let email = data.rows[0].email
            let gender = data.rows[0].gender
            let birthdate = data.rows[0].birthdate

            return new Student(id,first_name,last_name,email,gender,birthdate)
        })
        .catch(err => console.log(err))
    }

    static editStudent(id,data,cb){
        let alert = this.validation(data)
        if (alert.length> 0) {
            return alert
        } else {
            
            let {first_name, last_name,email,gender,birthdate} = data
            let query = `
            update "Students" 
            set ("first_name" , "last_name", "email", "gender", "birthdate") = ($1,$2,$3,$4,$5)
            where id = ${id}`
            
            let values = [first_name, last_name,email,gender,birthdate]
            
            return pool.query(query,values)
            .then(data =>{
                let newData = data.rows.map(el =>{
                    return new Student(el.id, el.first_name, el.last_name,el.email, el.gender,el.birthdate)
                }) 
                return newData
            })
            .catch(err => console.log(err))  
        }
    }

    static deleteStudent(id,cb){

        let query = `delete from "Students" where id = ${id}`
        
        pool.query(query,(err,data)=>{
            if (err) {
                cb(err)
            } else {
                cb(null,data)
            }
        })
    }

    static validation(data){
        let errors = []

        if(!data.first_name){
            errors.push(`First name must be filled`)
        }

        if(!data.last_name){
            errors.push(`last name must be filled`)
        }
        if(!data.email){
            errors.push(`Email must be filled`)
        }

        if(!data.gender){
            errors.push(`gender must be filled`)
        }

        if(!data.birthdate){
            errors.push(`Birthdate must be filled`)
        }

        return errors
    }
}

module.exports = StudentModel