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
            rule = z.string()
            if(!isUpdate && field.required) rule = rule.email(1, "Email is required")
            break;

        case "select" : 
            rule = z.string().min(1, `${field.name} is required`).refine(
                val => field.options.includes(val)
            )
            break;
        
        case "tel" : 
            rule = z.string().length(10, 'Phone number must be 10 digit')
            break;
        
        default : 
             rule = z.any()
        }

        shape[field.name] = rule;

    })

    return z.object(shape);
}