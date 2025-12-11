import { useState } from "react";
import { Badge, Button } from "react-bootstrap";
import { useGetUsersQuery } from "../services/userService";
import type { UserModel } from "../models/userModel";
import UserEditModal from "./modals/UserEditModal";
import UserDeleteModal from "./modals/UserDeleteModal";
import "./css/RawMaterialList.css"; // Tema

function UserList() {
  const { data: response, isLoading, isError } = useGetUsersQuery();

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserModel | null>(null);

  const handleOpenEditModal = (user: UserModel) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleOpenDeleteModal = (user: UserModel) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center mt-5">
        <div className="spinner-border text-success" role="status"></div>
        <span className="ms-2 fw-bold text-success">Kullanıcılar Yükleniyor...</span>
      </div>
    );
  }

  if (isError) {
    return <div className="alert alert-danger m-4 text-center">Veri alınamadı!</div>;
  }

  // API yapına göre data'yı alıyoruz
  const users: UserModel[] = response?.data || [];

  // Rol Rengi Belirleme Yardımcısı
  const getRoleBadge = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("admin") || t.includes("yonetici")) return <Badge bg="danger">YÖNETİCİ</Badge>;
    if (t.includes("kavurmacı")) return <Badge bg="warning" text="dark">KAVURMACI</Badge>;
    if (t.includes("satis") || t.includes("satış")) return <Badge bg="primary">SATIŞ PERSONELİ</Badge>;
    return <Badge bg="secondary">{title.toUpperCase()}</Badge>;
  };

  return (
    <>
      <div className="container-fluid px-4 mt-4">
        <div className="card shadow-lg border-0">
          
          {/* HEADER */}
          <div className="card-header card-header-fistik text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="bi bi-people-fill me-2"></i>Personel Listesi
            </h5>
            <Badge bg="light" text="dark" className="fs-6">
              Toplam {users.length} Kişi
            </Badge>
          </div>

          {/* BODY */}
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="thead-fistik">
                  <tr>
                    <th style={{ width: "50px" }}>ID</th>
                    <th>Ad Soyad</th>
                    <th>Yetki (Unvan)</th>
                    <th>İletişim</th>
                    <th>E-Posta</th>
                    <th className="text-center">Durum</th>
                    <th className="text-center" style={{ width: "120px" }}>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-5 text-muted">
                        <i className="bi bi-person-x fs-1 d-block mb-2 opacity-50"></i>
                        Kayıtlı kullanıcı bulunamadı.
                      </td>
                    </tr>
                  ) : (
                    users.map((user, index) => (
                      <tr key={user.id}>
                        <td className="fw-bold text-muted">#{index + 1}</td>
                        
                        <td>
                          <div className="d-flex align-items-center">
                              <div className="bg-light text-success rounded-circle d-flex align-items-center justify-content-center me-2 border" style={{width:35, height:35}}>
                                  <i className="bi bi-person-fill"></i>
                              </div>
                              <span className="fw-bold text-dark">{user.firstName} {user.lastName}</span>
                          </div>
                        </td>

                        <td>{getRoleBadge(user.title)}</td>

                        <td>
                           <i className="bi bi-telephone me-2 text-muted"></i>
                           {user.phoneNumber || "-"}
                        </td>

                        <td>
                           <span className="text-muted small">{user.email}</span>
                        </td>

                        <td className="text-center">
                          {user.status ? (
                              <span className="badge bg-success bg-opacity-10 text-success border border-success rounded-pill px-3">
                                  <i className="bi bi-check-circle-fill me-1"></i>Aktif
                              </span>
                          ) : (
                              <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary rounded-pill px-3">
                                  <i className="bi bi-dash-circle-fill me-1"></i>Pasif
                              </span>
                          )}
                        </td>

                        <td className="text-center">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-1"
                            onClick={() => handleOpenEditModal(user)}
                            title="Düzenle"
                          >
                            <i className="bi bi-pencil"></i>
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleOpenDeleteModal(user)}
                            title="Sil"
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <UserEditModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        user={selectedUser}
      />
      <UserDeleteModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        user={selectedUser}
      />
    </>
  );
}

export default UserList;