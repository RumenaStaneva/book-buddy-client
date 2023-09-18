const Button = (props) => {
    const { type, className, ...attributes } = props;

    return (
        <button type={type} onClick={props?.onClick} className={className} {...attributes}>
            {props.children}
        </button>
    );
};

export default Button;


