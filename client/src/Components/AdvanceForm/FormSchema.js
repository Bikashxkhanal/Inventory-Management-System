import { z } from 'zod';

export const buildSchema = (fields = [], isUpdate = false) => {
  const shape = {};

  fields.forEach((field) => {
    let rule;

    switch (field.type) {
      case "text":
        rule = z.string();
        if (field.required && !isUpdate) {
          rule = rule.min(1, `${field.name} is required`);
        }
        break;

      case "email":
        rule = z.string();
        if (field.required && !isUpdate) {
          rule = rule.email("Invalid email address");
        } else {
          rule = rule.optional();
        }
        break;
    
         case "date":
        rule = z.string().min(1, `${field.name} is required`).refine(
          val => !isNaN(Date.parse(val)),
          { message: `${field.name} must be a valid date` }
        );
        break;

      case "select":
        rule = z.string().min(1, `${field.name} is required`);
        // only refine if options exist
        if (field.options && field.options.length > 0) {
          rule = rule.refine(
            val => field.options.some(opt => val === (opt.value || opt)),
            { message: `${field.name} is invalid` }
          );
        }
        break;

      case "tel":
        rule = z.string().length(10, 'Phone number must be 10 digits');
        break;

      case "number":
        rule = z.number();
        if (field.required) {
          rule = rule.min(field.min || 0, `${field.name} must be at least ${field.min || 0}`);
        }
        break;

      default:
        rule = z.any();
    }

    shape[field.name] = rule;
  });

  return z.object(shape);
};
