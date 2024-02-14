import React from 'react';
import logo from './logo.svg';
import './App.css';
import Layout from './Layout';
import Trending from "./Trending";

function App() {
    return (
        <Layout>
            <div className="container mx-auto">
                <Trending/>
            </div>
        </Layout>
    );
}

export default App;
