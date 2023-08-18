import './global.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = (props: LayoutProps) => {
  return (
    <html lang='en'>
      <body>{props.children}</body>
    </html>
  );
};

export default Layout;
