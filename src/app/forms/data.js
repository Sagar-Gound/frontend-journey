export const topics = [
  {
    slug: "core-architecture",
    title: "Controlled vs Uncontrolled",
    tags: ["Controlled forms", "Uncontrolled forms"],
    description: "Understand the fundamental difference between storing form state in React (controlled) versus the DOM (uncontrolled).",
    insights: "For massive forms with dozens of fields, controlled components can cause crippling render lag. Uncontrolled forms (utilizing refs) eliminate re-renders on every keystroke, offering vastly superior performance.",
    code: `// Uncontrolled Form - Fast, no re-renders on typing
function UncontrolledForm() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted value:", inputRef.current?.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input ref={inputRef} name="username" defaultValue="admin" />
      <button type="submit">Submit</button>
    </form>
  );
}`
  },
  {
    slug: "modern-libraries",
    title: "React Hook Form",
    tags: ["React Hook Form", "Performance"],
    description: "The industry standard for building performant, flexible, and extensible forms with easy-to-use validation.",
    insights: "React Hook Form defaults to uncontrolled inputs internally, instantly solving the performance bottlenecks of traditional React forms while still providing a controlled-like developer experience.",
    code: `import { useForm } from 'react-hook-form';

export function BasicRHF() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('firstName', { required: true })} />
      {errors.firstName && <span>First name is required</span>}
      <button type="submit">Submit</button>
    </form>
  );
}`
  },
  {
    slug: "schema-validation",
    title: "Schema Validation",
    tags: ["Zod", "Yup", "Validation"],
    description: "Declare the shape and rules of your data upfront using powerful schema validation libraries like Zod or Yup.",
    insights: "Zod is generally preferred in the modern ecosystem because its type inference is best-in-class. You define the schema once, and you instantly get both runtime validation and perfect TypeScript types.",
    code: `import { z } from 'zod';

// Define the schema once
const userSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  age: z.number().min(18, "Must be an adult")
});

// Automatically infer the TypeScript type
type User = z.infer<typeof userSchema>;`
  },
  {
    slug: "ultimate-stack",
    title: "The Ultimate Stack",
    tags: ["React Hook Form", "Zod", "API Validation", "Error Handling"],
    description: "Combining React Hook Form for performance, Zod for schema validation, and robust API error handling.",
    insights: "This is the holy grail. Use the hookform resolver for Zod. Ensure your API returns validation errors in a format that RHF can map directly back to the fields (e.g., setting field errors from the server response).",
    code: `import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password too short"),
});

type FormData = z.infer<typeof schema>;

export function ModernForm() {
  const { register, handleSubmit, setError, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Simulated API Call
      const res = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      
      const responseData = await res.json();
      
      if (!res.ok) {
        // Handling API-level validation errors (e.g., "Email already in use")
        if (responseData.fieldErrors) {
          Object.keys(responseData.fieldErrors).forEach(field => {
             setError(field as keyof FormData, { message: responseData.fieldErrors[field] });
          });
        }
        return;
      }
      
      // Success logic...
    } catch (err) {
      setError('root', { message: 'A network error occurred.' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <label>Email</label>
        <input {...register('email')} disabled={isSubmitting} />
        {errors.email && <span style={{color: 'red'}}>{errors.email.message}</span>}
      </div>
      
      <div>
        <label>Password</label>
        <input type="password" {...register('password')} disabled={isSubmitting} />
        {errors.password && <span style={{color: 'red'}}>{errors.password.message}</span>}
      </div>

      {errors.root && <div style={{color: 'red'}}>{errors.root.message}</div>}
      {isSubmitSuccessful && <div style={{color: 'green'}}>Success!</div>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Loading...' : 'Login'}
      </button>
    </form>
  );
}`
  },
  {
    slug: "advanced-scenarios",
    title: "Advanced Scenarios",
    tags: ["Async validation", "File uploads", "Multi-step forms", "Dynamic fields", "Conditional fields"],
    description: "Handling complex requirements like uploading files, paginated wizards, and fields that change based on other inputs.",
    insights: "For dynamic fields (like adding multiple addresses), use React Hook Form's 'useFieldArray'. For multi-step forms, keep the form state in a parent component or a lightweight state manager like Zustand so data persists between steps.",
    code: `import { useForm, useFieldArray } from 'react-hook-form';

export function DynamicForm() {
  const { register, control, handleSubmit, watch } = useForm({
    defaultValues: { users: [{ name: '' }], hasReferral: false }
  });
  
  const { fields, append, remove } = useFieldArray({ control, name: "users" });
  const hasReferral = watch("hasReferral"); // Conditional logic trigger

  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input {...register(\`users.\${index}.name\`)} />
          <button type="button" onClick={() => remove(index)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={() => append({ name: '' })}>Add User</button>
      
      <div>
        <label>
          <input type="checkbox" {...register("hasReferral")} /> 
          I have a referral code
        </label>
      </div>

      {/* Conditional Field */}
      {hasReferral && (
        <input placeholder="Referral Code" {...register("referralCode")} />
      )}
      
      <button type="submit">Submit</button>
    </form>
  );
}`
  }
];
