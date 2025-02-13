import Footer from "./Footer";
import NavBar from "./NavBar";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy">
      <NavBar />
      <div className="main-content">
        <h1>隐私政策</h1>
        <div className="term-item">
          <p>
            最后更新日期： 2025年2月12日
            <br />
            生效日期： 2025年2月12日
            <br />
            <i>
              本政策仅适用于个人兴趣项目，不构成法律建议。如果您需要专业合规方案，请咨询律师。
            </i>
          </p>
          <hr />
        </div>
        <div className="term-item">
          <h3>我们收集的信息</h3>
          <p>
            <b>直接提供的信息：</b>
            <ul>
              <li>电子邮箱地址：用于创建账户、发送重要通知（如密码重置）。</li>
              <li>
                出生时间地点相关数据：您可选择输入个人或他人的出生时间、地点等信息以生成占星档案。
                <b>请注意：</b>如果您输入他人数据，需确保已获得其同意。
              </li>
              <li>
                联系方式（可选）：当您通过意见反馈功能提交留言时，可选择提供邮箱地址或微信号，以便我们就反馈内容与您联系。
                <b>请注意：</b>若提供他人联系方式，需已获得其明确授权。
              </li>
            </ul>
            <b>自动收集的信息：</b>
            <ul>
              <li>
                技术数据：包括IP地址、浏览器类型、访问时间等（通过Cookies和类似技术收集）。
              </li>
            </ul>
          </p>
        </div>
        <div className="term-item">
          <h3>信息使用方式</h3>
          <p>
            <b>核心用途：</b>
            <ul>
              <li>生成并存储用户创建的占星档案。</li>
              <li>
                通过邮箱向用户发送账户相关通知（如密码重置、隐私政策变更）。
              </li>
              <li>
                通过用户提供的邮箱或微信号，就提交的反馈进行回复或技术协助。
              </li>
            </ul>
            <b>匿名化处理：</b>
            <ul>
              <li>
                我们可能对去标识化的数据进行统计性分析（如“现有档案的出生年份统计”），但不会关联到具体个人。
              </li>
            </ul>
          </p>
        </div>
        <div className="term-item">
          <h3>数据存储与安全</h3>
          <p>
            <b>存储位置：</b>
            <ul>
              <li>
                数据存储在<a href="https://render.com/">Render</a>的云端服务器。
              </li>
            </ul>
            <b>安全措施：</b>
            <ul>
              <li>
                授权访问：您的数据仅对已登录的您本人可见。我们通过严格的用户身份验证机制（如access
                token）确保只有您能访问自己创建的档案信息，其他用户无法查看。
              </li>
              <li>传输加密：使用SSL/TLS协议保护数据传输。</li>
              <li>
                密码保护：用户密码经哈希处理存储于数据库，明文密码无法被查看。
              </li>
              <li>
                访问限制：仅网站管理员可查看反馈内容及联系方式，其他用户无法访问。
              </li>
              <li>
                <b>请注意：</b>
                作为个人项目，我们无法提供企业级安全防护，请您理解相关风险。
              </li>
            </ul>
          </p>
        </div>
        <div className="term-item">
          <h3>数据共享与披露</h3>
          <p>
            <b>我们不会主动共享您的个人信息</b>，除非：
            <ul>
              <li>您明确同意披露（如反馈涉及第三方服务商问题需转交处理）。</li>
              <li>应法律要求或配合司法调查（如收到法院传票）。</li>
              <li>为保护本网站、其他用户或公众的安全而必需的披露。</li>
            </ul>
            <b>第三方服务：</b>
            <ul>
              <li>
                本网站可能使用Google
                Analytics进行访问统计，这些服务商有其独立的隐私政策。
              </li>
            </ul>
          </p>
        </div>
        <div className="term-item">
          <h3>您的权利</h3>
          <p>
            <b>访问与更正：</b>您可随时登录账户查看或修改提交的数据。
            <br />
            <b>数据删除：</b>
            如需彻底删除账户及数据（包括反馈内容和联系方式），请发送邮件至
            <a href="mailto:astro.archive.contact@gmail.com">
              astro.archive.contact@gmail.com
            </a>
            ，我们将在14个工作日内处理。 <br />
            <b>拒绝Cookies：</b>
            您可通过浏览器设置拒绝非必要Cookies，但可能导致部分功能不可用。
          </p>
        </div>
        <div className="term-item">
          <h3>政策变更</h3>
          <p>
            我们保留修改本政策的权利，变更将通过网站公告或注册邮箱通知生效。继续使用服务即视为接受更新后的政策。
          </p>
        </div>
        <div className="term-item">
          <h3>联系我们</h3>
          <p>
            如有疑问，请通过
            <a href="mailto:astro.archive.contact@gmail.com">
              astro.archive.contact@gmail.com
            </a>
            与我们联系。
            <br />
            <b>请注意：</b>
            本网站为个人兴趣项目，无专业法律团队支持，回复可能延迟。
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
