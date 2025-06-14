import { useState, useCallback } from 'react';
import { validatePassword } from '../utils/helpers';

/**
 * Custom hook for managing form state and validation
 * @param {Object} initialValues - Initial form values
 * @param {Function} validate - Validation function
 * @returns {Object} Form utilities and state
 */
const useForm = (initialValues = {}, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input change
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    setValues(prevValues => ({
      ...prevValues,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: null,
      }));
    }
  }, [errors]);

  // Handle input blur
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: true,
    }));

    // Run validation if validate function is provided
    if (validate) {
      const validationErrors = validate(values);
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: validationErrors[name],
      }));
    }
  }, [validate, values]);

  // Set a field value manually
  const setFieldValue = useCallback((name, value) => {
    setValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  }, []);

  // Set a field error manually
  const setFieldError = useCallback((name, error) => {
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error,
    }));
  }, []);

  // Set a field as touched
  const setFieldTouched = useCallback((name, isTouched = true) => {
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: isTouched,
    }));
  }, []);

  // Validate all fields
  const validateForm = useCallback(() => {
    if (!validate) return true;
    
    const validationErrors = validate(values);
    setErrors(validationErrors);
    
    // Check if there are any errors
    return Object.keys(validationErrors).length === 0;
  }, [validate, values]);

  // Reset form to initial values
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Handle form submission
  const handleSubmit = useCallback((onSubmit) => async (e) => {
    if (e) e.preventDefault();
    
    // Validate form before submission
    const isValid = validate ? validateForm() : true;
    
    if (isValid) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Mark all fields as touched to show errors
      const allTouched = Object.keys(values).reduce((acc, key) => ({
        ...acc,
        [key]: true,
      }), {});
      setTouched(allTouched);
    }
  }, [validate, validateForm, values]);

  // Get field props for form inputs
  const getFieldProps = useCallback((name) => ({
    name,
    value: values[name] ?? '',
    onChange: handleChange,
    onBlur: handleBlur,
  }), [handleBlur, handleChange, values]);

  // Check if field has an error and has been touched
  const hasError = useCallback((name) => {
    return !!(touched[name] && errors[name]);
  }, [errors, touched]);

  // Get error message for a field
  const getError = useCallback((name) => {
    return touched[name] ? errors[name] : '';
  }, [errors, touched]);

  // Check if the form is valid
  const isValid = useCallback(() => {
    if (!validate) return true;
    const validationErrors = validate(values);
    return Object.keys(validationErrors).length === 0;
  }, [validate, values]);

  return {
    // Form state
    values,
    errors,
    touched,
    isSubmitting,
    
    // Form actions
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    
    // Field utilities
    setFieldValue,
    setFieldError,
    setFieldTouched,
    getFieldProps,
    hasError,
    getError,
    
    // Validation
    validate: validateForm,
    isValid: isValid(),
    
    // Form status
    isDirty: JSON.stringify(values) !== JSON.stringify(initialValues),
    isPristine: JSON.stringify(values) === JSON.stringify(initialValues),
  };
};

export default useForm;
