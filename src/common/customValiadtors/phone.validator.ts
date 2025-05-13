import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { isPhoneNumber } from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsEgyptianOrSaudiPhoneConstraint implements ValidatorConstraintInterface {
  validate(phoneNumber: string) {
    return isPhoneNumber(phoneNumber, 'EG') || isPhoneNumber(phoneNumber, 'SA');
  }

  defaultMessage() {
    return 'phoneNumber must be a valid Egyptian or Saudi phone number';
  }
}

export function IsEgyptianOrSaudiPhone(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEgyptianOrSaudiPhoneConstraint,
    });
  };
}
