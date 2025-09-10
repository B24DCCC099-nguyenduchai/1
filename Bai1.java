class HinhChuNhat {
    private double chieuDai;
    private double chieuRong;


    public HinhChuNhat(double chieuDai, double chieuRong) {
        this.chieuDai = chieuDai;
        this.chieuRong = chieuRong;
    }

  
    public double tinhChuVi() {
        return 2 * (chieuDai + chieuRong);
    }

    public double tinhDienTich() {
        return chieuDai * chieuRong;
    }

    public void hienThi() {

        System.out.println("Chieu dai: " + chieuDai);
        System.out.println("Chieu rong: " + chieuRong);
        System.out.println("Chu vi    : " + tinhChuVi());
        System.out.println("Dien tich : " + tinhDienTich());
    }    
      
}


public class Bai1 {
    public static void main(String[] args) {
        HinhChuNhat h1 = new HinhChuNhat(5, 3);
        HinhChuNhat h2 = new HinhChuNhat(10, 4.5);
        HinhChuNhat h3 = new HinhChuNhat(7.2, 6);
        h1.hienThi();
        h2.hienThi();
        h3.hienThi();
    }
}
