import css from './LayoutNotes.module.css';

interface NotesLayoutProps {
    children: React.ReactNode;
    sidebar: React.ReactNode;
    modal?: React.ReactNode;  
}

const NotesLayout = ({ children, sidebar, modal }: NotesLayoutProps) => {
    return (
        <section className={css.container}>
            <aside className={css.sidebar}>{sidebar}</aside>
            <div className={css.notesWrapper}>{children}</div>
            {modal} 
        </section>
    );
};
export default NotesLayout; 