
//Generic custom Button component
export default function Button({children, textOnly, className, ...props}){
    //Conditional css classes
    let cssClasses = textOnly ? 'text-button' : 'button';
    cssClasses += ' ' + className;

    return <button className={cssClasses} {...props}>
        {children}
        </button>;
}