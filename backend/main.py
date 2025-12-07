""" from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, product, order, import_stock, customer 

app = FastAPI(title="Pharmacy Shop API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đúng tên file router
app.include_router(auth.router, prefix="/api/auth")
app.include_router(product.router, prefix="/api/products")
app.include_router(order.router, prefix="/api/orders")
app.include_router(import_stock.router, prefix="/api/import")
app.include_router(customer.router, prefix="/api/customers")

@app.get("/")
def home():
    return {"message": "Backend đang chạy ngon lành!"} """
    
    
    
    
    
    
    
    
    
# main.py
""" from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, product, order, import_stock, customer

app = FastAPI(title="Pharmacy Shop API", version="1.0")

# CORS middleware chuẩn
origins = [
    "http://localhost:5173",  # URL frontend của bạn
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # chỉ cho phép frontend của bạn
    allow_credentials=True,  # để cookie/token được gửi
    allow_methods=["*"],     # GET, POST, PUT, DELETE...
    allow_headers=["*"],     # tất cả headers
)

# Routers
app.include_router(auth.router, prefix="/api/auth")
app.include_router(product.router, prefix="/api/products")
app.include_router(order.router, prefix="/api/orders")
app.include_router(import_stock.router, prefix="/api/import")
app.include_router(customer.router, prefix="/api/customers")

@app.get("/")
def home():
    return {"message": "Backend đang chạy ngon lành!"} """
    
    
    
    
    
    
    
    
    
    
    
    
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, product, order, import_stock, customer, dashboard

app = FastAPI(title="Pharmacy Shop API", version="1.0")

# CORS middleware: cho phép frontend localhost:5173 truy cập
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include các router
app.include_router(auth.router, prefix="/api/auth")
app.include_router(product.router, prefix="/api/products")
app.include_router(order.router, prefix="/api/orders")
app.include_router(import_stock.router, prefix="/api/import")
app.include_router(customer.router, prefix="/api/customers")
app.include_router(dashboard.router, prefix="/api/dashboard")

# Route test
@app.get("/")
def home():
    return {"message": "Backend đang chạy ngon lành!"}

    
    