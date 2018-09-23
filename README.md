# AuthTag
A blockchain backed RFID tag that verifies authenticity of a product and check ownership history, this is mostly the backend for the project.

project is for 2018 SAP Hackathon at Newtown Square
Endpoints includes
`post /manufacture/product`
to post product to the blockchain and add product information

`post /manufacture/verify`
to verify a RFID's tag id is authentic by checking in the blockchain and returning product info and ownership info

`post /transferOwnership`

`post /claimOwnership`

`post /releaseOwnership`

All using post to reduce the amount of work needed in the frontend so everything can be submitted in the body and doesn't have to switch between post and gets

`post /auth/login`

`post /auth/signup`


