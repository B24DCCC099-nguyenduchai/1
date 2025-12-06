from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, product, order, import_stock, customer 

app = FastAPI(title="Pharmacy Shop API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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
    return {"message": "Backend đang chạy ngon lành!"}