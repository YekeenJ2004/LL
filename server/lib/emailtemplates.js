export const applyHtmlContent = (username, text)=>{
    return(
        `<div style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
            <div class="header" style="text-align: center; padding: 10px;">
                <img src="https://linkloop.app/favicon.ico" alt="Company Logo" style="width: 150px;">
            </div>

            <div class="content" style="padding: 20px;">
                <h3>Hello, ${username}</h3>
                <p>We are excited to share with you that we have recieved your application to use our services. If you are a good fit for us, you will be</p>
                <!-- Your email content goes here -->
            </div>

            <div class="footer" style="text-align: center; background-color: #f2f2f2; padding: 20px; font-size: 12px;">
                <img src="https://linkloop.app/favicon.ico" alt="Company Logo" style="width: 50px; vertical-align: middle;">
                <span style="margin: 0 10px;">
                    <a href="mailto:hello@linkloop.app" style="color: #333; text-decoration: none;">hello@linkloop.app</a>
                </span>
                <span style="margin: 0 10px;">
                    <a href="https://www.linkloop.app" style="color: #333; text-decoration: none;">www.Link Loop.com</a>
                </span>
            </div>
        </div>`
    )
}


