interface ErrorProps {
  message: string;
}

const Error = ({ message }: ErrorProps) => <div style={{ color: 'red' }}>{message}</div>;
export default Error;