import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Footer() {
    return (
        <div>
            <main className="content">
                {/* Your main content goes here */}
            </main>
            <footer style={{ padding: '20px', marginTop: 'auto', backgroundColor: '#2c3e50', color: '#ecf0f1' }} className="footer-main">
                <div className="container">
                    <div className="row address-main">
                        {/* Address section */}
                        <div className="col-lg-4 col-sm-12 col-xs-12">
                            <div style={{ marginBottom: '20px', backgroundColor: '#34495e', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }} className="address-box clearfix text-light">
                                
                                <div className="add-content">
                                    <h5>Address</h5>
                                    <p>
                                        Bruce House,
                                        Koinange Street,
                                        Nairobi, Kenya.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-sm-12 col-xs-12">
                            <div style={{ marginBottom: '20px', backgroundColor: '#34495e', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }} className="address-box clearfix text-light">
                                
                                <div className="add-content">
                                    <h5>Phone</h5>
                                    <p>
                                        +(254) 000000000 <br />
                                        +(254) 000000000
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-sm-12 col-xs-12">
                            <div style={{ marginBottom: '20px', backgroundColor: '#34495e', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }} className="address-box clearfix text-light">
                                
                                <div className="add-content">
                                    <h5>Email</h5>
                                    <p>
                                        <a href="mailto:collab@codewithfaraz.com" style={{ textDecoration: 'none', color: '#ecf0f1' }}>
                                            havenspaceltd@hotmail.com
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                
                <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }} className="text-center p-3 text-white">
                    Haven Space LTD © 2022 All Rights Reserved.
                </div>
            </footer>
        </div>
    );
}

export default Footer;