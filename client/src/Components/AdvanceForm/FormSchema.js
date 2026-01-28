import { z} from 'zod';

export const buildSchema = (fields = [], isUpdate) => {
    const shape = {}
    
    fields.forEach((field)=> {
        let rule ;

        switch (field.type){
            case "text" : 
            rule = z.string()
            if(field.requied && !isUpdate ) rule = rule.min(1, 'Required')
            break;


        case "email" : 
            rule = z.email("Invalid email")
            if(!isUpdate && field.required) rule = rule.min(1, "Required")
            break;

        case "select" : 
            rule = z.enum(field.options)
            break;
        
        case "tel" : 
            rule = z.number().positive().min(10).max(10)
            break;
        
        default : 
             rule = z.any()
        }

        shape[field.name] = rule;

    })

    return z.object(shape);
}