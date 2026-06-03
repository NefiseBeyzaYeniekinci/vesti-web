# Vesti AI Model Training Instructions (Google Colab)

Bu rehber, Vesti projesi için Google Colab üzerinde bir yapay zeka (AI) modelini eğitmek için kullanılacak adımları içerir. Bu eğitim tamamlandıktan sonra elde edilen model, Adım 4'te projeye entegre edilecektir.

## 1. Google Colab Nedir?
Google Colab, tarayıcınız üzerinden ücretsiz GPU desteği ile Python kodu yazmanızı ve çalıştırmanızı sağlayan bir platformdur. Makine öğrenmesi ve yapay zeka eğitimleri için idealdir.

## 2. Hazırlık Aşaması
İlk olarak aşağıdaki bağlantıya giderek yeni bir not defteri (notebook) oluşturun:
[Google Colab](https://colab.research.google.com/)

**Önemli:** Eğitimi hızlandırmak için üst menüden `Çalışma Zamanı` > `Çalışma zamanı türünü değiştir` (Runtime > Change runtime type) seçeneğine tıklayın ve Donanım hızlandırıcı (Hardware accelerator) olarak **GPU**'yu (örneğin T4 GPU) seçin.

## 3. Kullanılacak Model
Hangi önceden eğitilmiş (pre-trained) modeli kullanacağımızı belirlememiz gerekiyor. Genellikle kıyafet tanıma/sınıflandırma gibi işlemler için şu modeller tercih edilir:

1. **Hugging Face Transformers (Örn: ViT - Vision Transformer):** Görsel sınıflandırma için çok güçlüdür.
2. **YOLO (You Only Look Once):** Resimdeki kıyafetlerin yerini tespit etmek (object detection) ve sınıflandırmak için kullanılır.
3. **ResNet / MobileNet (TensorFlow/Keras veya PyTorch):** Daha hafif ve hızlı görsel sınıflandırma modelleridir.

Lütfen eğitim amacınızı (sınıflandırma mı, nesne tespiti mi vs.) ve hangi veri setini kullanacağımızı (örn: Kaggle'dan Fashion MNIST veya özel bir veri seti) belirtin. Buna göre size doğrudan Colab'e kopyalayıp yapıştırabileceğiniz Python (PyTorch/TensorFlow) kodlarını hazırlayacağım.
